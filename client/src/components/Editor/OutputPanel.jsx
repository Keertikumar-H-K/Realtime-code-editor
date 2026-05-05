import { useState, useEffect, useRef } from 'react';

const OutputPanel = ({ output, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const contentRef = useRef(null);

  // Slide-in animation on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [output]);

  if (!output) return null;

  const { success, output: stdout, error, executionTime } = output;
  const hasOutput  = stdout && stdout.trim().length > 0;
  const hasError   = error  && error.trim().length > 0;
  const isSuccess  = success === true || (success !== false && !hasError);
  const displayText = hasError ? error : hasOutput ? stdout : 'Program exited with no output.';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.2s ease',
      }}
      className="flex flex-col bg-[#0d1117] border-t border-slate-700"
      style={{ height: '220px', flexShrink: 0, ...( visible
        ? { transform: 'translateY(0)', transition: 'transform 0.2s ease' }
        : { transform: 'translateY(100%)', transition: 'transform 0.2s ease' }
      )}}
    >
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-[#161b22] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Terminal dots */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
            <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          </div>

          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Output
          </span>

          {/* Status badge */}
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isSuccess
              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
              : 'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-green-400' : 'bg-red-400'}`} />
            {isSuccess ? 'Success' : 'Error'}
          </span>

          {executionTime > 0 && (
            <span className="text-xs text-slate-600 font-mono">
              ⏱ {executionTime < 1000
                ? `${executionTime}ms`
                : `${(executionTime / 1000).toFixed(2)}s`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all"
            title="Copy output"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-all"
            title="Close output"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Terminal content ── */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed"
        style={{ background: '#0d1117' }}
      >
        {/* Prompt line */}
        <div className="flex items-center gap-2 mb-2 opacity-50">
          <span className="text-purple-400">❯</span>
          <span className="text-slate-500 text-xs">program output</span>
        </div>

        {hasError ? (
          <pre className="text-red-400 whitespace-pre-wrap break-words">
            {error}
          </pre>
        ) : hasOutput ? (
          <pre className="text-emerald-400 whitespace-pre-wrap break-words">
            {stdout}
          </pre>
        ) : (
          <pre className="text-slate-600 whitespace-pre-wrap italic">
            Program exited with no output.
          </pre>
        )}

        {/* Exit line */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 opacity-60">
          <span className={`text-xs ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {isSuccess ? '✓ Process exited cleanly' : '✗ Process exited with error'}
          </span>
          {executionTime > 0 && (
            <span className="text-xs text-slate-600">
              · {executionTime < 1000 ? `${executionTime}ms` : `${(executionTime / 1000).toFixed(2)}s`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;