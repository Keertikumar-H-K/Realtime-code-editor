// Judge0 CE - Free open-source code execution
// Public instance: https://ce.judge0.com
// Docs: https://ce.judge0.com/

const JUDGE0_URL = 'https://ce.judge0.com';

// Judge0 language IDs — full list at https://ce.judge0.com/languages
const LANGUAGE_CONFIGS = {
  javascript: { id: 63,  fileName: 'main.js'    },
  typescript: { id: 74,  fileName: 'main.ts'    },
  python:     { id: 71,  fileName: 'main.py'    },
  cpp:        { id: 54,  fileName: 'main.cpp'   },
  c:          { id: 50,  fileName: 'main.c'     },
  java:       { id: 62,  fileName: 'Main.java'  },
  go:         { id: 60,  fileName: 'main.go'    },
  rust:       { id: 73,  fileName: 'main.rs'    },
};

// Judge0 status IDs
const STATUS = {
  IN_QUEUE:         1,
  PROCESSING:       2,
  ACCEPTED:         3,
  WRONG_ANSWER:     4,
  TIME_LIMIT:       5,
  COMPILATION_ERR:  6,
  RUNTIME_ERR_SIGSEGV: 7,
  RUNTIME_ERR_SIGXFSZ: 8,
  RUNTIME_ERR_SIGFPE:  9,
  RUNTIME_ERR_SIGABRT: 10,
  RUNTIME_ERR_NZEC:    11,
  RUNTIME_ERR_OTHER:   12,
  INTERNAL_ERR:    13,
  EXEC_FORMAT_ERR: 14,
};

/**
 * Base64 encode/decode helpers (Judge0 uses base64 I/O)
 */
const b64Encode = (str) => btoa(unescape(encodeURIComponent(str)));
const b64Decode = (str) => {
  try { return str ? decodeURIComponent(escape(atob(str))) : ''; }
  catch { return str || ''; }
};

/**
 * Execute code using Judge0 CE public instance
 */
export const executeCode = async (code, language) => {
  const config = LANGUAGE_CONFIGS[language.toLowerCase()];

  if (!config) {
    return {
      success: false,
      output: '',
      error: `Language '${language}' is not supported`,
      executionTime: 0
    };
  }

  const startTime = Date.now();

  try {
    // ── Step 1: Submit ──────────────────────────────────────────────────────
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id:  config.id,
        source_code:  b64Encode(code),
        // Sensible limits so runaway loops don't hang the UI
        cpu_time_limit:         5,      // seconds
        memory_limit:           128000, // KB (~128 MB)
        wall_time_limit:        10,
      })
    });

    if (!submitRes.ok) {
      const msg = await submitRes.text();
      throw new Error(`Submission failed (${submitRes.status}): ${msg}`);
    }

    const { token } = await submitRes.json();
    if (!token) throw new Error('No submission token received from Judge0');

    // ── Step 2: Poll until done ─────────────────────────────────────────────
    let result = null;
    const MAX_POLLS = 20;
    const POLL_INTERVAL_MS = 600;

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

      const pollRes = await fetch(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,status,time,memory,compile_output`,
        { method: 'GET' }
      );

      if (!pollRes.ok) continue;

      result = await pollRes.json();
      const statusId = result.status?.id;

      // Still running → keep polling
      if (statusId === STATUS.IN_QUEUE || statusId === STATUS.PROCESSING) continue;

      // Any other status = finished
      break;
    }

    if (!result) throw new Error('Execution timed out waiting for Judge0 response');

    const executionTime = Date.now() - startTime;
    const statusId      = result.status?.id;
    const statusDesc    = result.status?.description || 'Unknown';

    const stdout         = b64Decode(result.stdout);
    const stderr         = b64Decode(result.stderr);
    const compileOutput  = b64Decode(result.compile_output);

    // ── Step 3: Interpret result ────────────────────────────────────────────
    if (statusId === STATUS.COMPILATION_ERR) {
      return {
        success: false,
        output: '',
        error: compileOutput || 'Compilation error',
        executionTime
      };
    }

    if (statusId === STATUS.TIME_LIMIT) {
      return {
        success: false,
        output: stdout,
        error: '⏱ Time limit exceeded (5s) — check for infinite loops',
        executionTime
      };
    }

    if (statusId === STATUS.ACCEPTED) {
      return {
        success: true,
        output: stdout || '(no output)',
        error: stderr || null,
        executionTime
      };
    }

    // Runtime errors / other failures
    return {
      success: false,
      output: stdout || '',
      error: stderr || compileOutput || `Runtime error: ${statusDesc}`,
      executionTime
    };

  } catch (err) {
    console.error('Execution error:', err);
    const executionTime = Date.now() - startTime;

    const isNetwork = err.message?.includes('Failed to fetch')
                   || err.message?.includes('NetworkError');
    return {
      success: false,
      output: '',
      error: isNetwork
        ? 'Code execution service is unreachable. Check your internet connection.'
        : err.message || 'Execution failed',
      executionTime
    };
  }
};

export const getSupportedLanguages = () => Object.keys(LANGUAGE_CONFIGS);

// Judge0 doesn't have a "runtimes" endpoint but we keep the same API shape
export const getRuntimes = async () => {
  const res = await fetch(`${JUDGE0_URL}/languages`);
  return res.ok ? res.json() : [];
};

export default { executeCode, getRuntimes, getSupportedLanguages };