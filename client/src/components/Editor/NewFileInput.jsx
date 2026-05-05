import { useState, useEffect, useRef } from 'react';

// ─── Supported extensions registry ────────────────────────────────────────────
const EXTENSION_MAP = {
  // JavaScript ecosystem
  js:   { language: 'javascript', label: 'JavaScript',  icon: 'JS',  iconBg: '#f7df1e', iconColor: '#000', valid: true },
  jsx:  { language: 'javascript', label: 'React JSX',   icon: '⚛',   iconBg: '#20232a', iconColor: '#61dafb', valid: true },
  ts:   { language: 'typescript', label: 'TypeScript',  icon: 'TS',  iconBg: '#3178c6', iconColor: '#fff', valid: true },
  tsx:  { language: 'typescript', label: 'React TSX',   icon: '⚛',   iconBg: '#3178c6', iconColor: '#fff', valid: true },
  mjs:  { language: 'javascript', label: 'ES Module',   icon: 'MJS', iconBg: '#f7df1e', iconColor: '#000', valid: true },
  cjs:  { language: 'javascript', label: 'CommonJS',    icon: 'CJS', iconBg: '#f7df1e', iconColor: '#000', valid: true },

  // Python
  py:   { language: 'python',     label: 'Python',      icon: '🐍',  iconBg: '#3572a5', iconColor: '#fff', valid: true },
  pyw:  { language: 'python',     label: 'Python (Win)',icon: '🐍',  iconBg: '#3572a5', iconColor: '#fff', valid: true },

  // Web
  html: { language: 'html',       label: 'HTML',        icon: 'H5',  iconBg: '#e34c26', iconColor: '#fff', valid: true },
  htm:  { language: 'html',       label: 'HTML',        icon: 'H5',  iconBg: '#e34c26', iconColor: '#fff', valid: true },
  css:  { language: 'css',        label: 'CSS',         icon: '🎨',  iconBg: '#563d7c', iconColor: '#fff', valid: true },
  scss: { language: 'scss',       label: 'SCSS',        icon: '🎨',  iconBg: '#c6538c', iconColor: '#fff', valid: true },
  sass: { language: 'sass',       label: 'Sass',        icon: '🎨',  iconBg: '#c6538c', iconColor: '#fff', valid: true },
  less: { language: 'less',       label: 'Less',        icon: '🎨',  iconBg: '#1d365d', iconColor: '#fff', valid: true },
  svg:  { language: 'xml',        label: 'SVG',         icon: '◈',   iconBg: '#ffb13b', iconColor: '#000', valid: true },

  // Systems languages
  c:    { language: 'c',          label: 'C',           icon: 'C',   iconBg: '#555555', iconColor: '#fff', valid: true },
  cpp:  { language: 'cpp',        label: 'C++',         icon: 'C++', iconBg: '#f34b7d', iconColor: '#fff', valid: true },
  cc:   { language: 'cpp',        label: 'C++',         icon: 'C++', iconBg: '#f34b7d', iconColor: '#fff', valid: true },
  cxx:  { language: 'cpp',        label: 'C++',         icon: 'C++', iconBg: '#f34b7d', iconColor: '#fff', valid: true },
  h:    { language: 'c',          label: 'C Header',    icon: 'H',   iconBg: '#555555', iconColor: '#fff', valid: true },
  hpp:  { language: 'cpp',        label: 'C++ Header',  icon: 'H++', iconBg: '#f34b7d', iconColor: '#fff', valid: true },
  cs:   { language: 'csharp',     label: 'C#',          icon: 'C#',  iconBg: '#178600', iconColor: '#fff', valid: true },
  java: { language: 'java',       label: 'Java',        icon: '☕',  iconBg: '#b07219', iconColor: '#fff', valid: true },
  rs:   { language: 'rust',       label: 'Rust',        icon: '⚙',   iconBg: '#dea584', iconColor: '#000', valid: true },
  go:   { language: 'go',         label: 'Go',          icon: 'Go',  iconBg: '#00add8', iconColor: '#fff', valid: true },
  rb:   { language: 'ruby',       label: 'Ruby',        icon: '💎',  iconBg: '#701516', iconColor: '#fff', valid: true },
  php:  { language: 'php',        label: 'PHP',         icon: '🐘',  iconBg: '#4f5d95', iconColor: '#fff', valid: true },
  swift:{ language: 'swift',      label: 'Swift',       icon: '🦅',  iconBg: '#f05138', iconColor: '#fff', valid: true },
  kt:   { language: 'kotlin',     label: 'Kotlin',      icon: 'K',   iconBg: '#7f52ff', iconColor: '#fff', valid: true },
  kts:  { language: 'kotlin',     label: 'Kotlin Script',icon: 'KTS',iconBg: '#7f52ff', iconColor: '#fff', valid: true },

  // Data / Config
  json: { language: 'json',       label: 'JSON',        icon: '{}',  iconBg: '#cbcb41', iconColor: '#000', valid: true },
  yaml: { language: 'yaml',       label: 'YAML',        icon: 'Y',   iconBg: '#cb171e', iconColor: '#fff', valid: true },
  yml:  { language: 'yaml',       label: 'YAML',        icon: 'Y',   iconBg: '#cb171e', iconColor: '#fff', valid: true },
  toml: { language: 'ini',        label: 'TOML',        icon: 'T',   iconBg: '#9c4121', iconColor: '#fff', valid: true },
  xml:  { language: 'xml',        label: 'XML',         icon: 'XML', iconBg: '#f60', iconColor:    '#fff', valid: true },
  env:  { language: 'plaintext',  label: 'Env File',    icon: '⚙',   iconBg: '#ecd53f', iconColor: '#000', valid: true },

  // Shell / Scripts
  sh:   { language: 'shell',      label: 'Shell Script',icon: '$_',  iconBg: '#89e051', iconColor: '#000', valid: true },
  bash: { language: 'shell',      label: 'Bash',        icon: '$_',  iconBg: '#89e051', iconColor: '#000', valid: true },
  zsh:  { language: 'shell',      label: 'Zsh',         icon: '$_',  iconBg: '#89e051', iconColor: '#000', valid: true },
  ps1:  { language: 'powershell', label: 'PowerShell',  icon: 'PS',  iconBg: '#012456', iconColor: '#fff', valid: true },
  bat:  { language: 'bat',        label: 'Batch',       icon: 'BAT', iconBg: '#c1f12e', iconColor: '#000', valid: true },

  // Docs
  md:   { language: 'markdown',   label: 'Markdown',    icon: 'M↓',  iconBg: '#519aba', iconColor: '#fff', valid: true },
  mdx:  { language: 'markdown',   label: 'MDX',         icon: 'MDX', iconBg: '#fcb32c', iconColor: '#000', valid: true },
  txt:  { language: 'plaintext',  label: 'Plain Text',  icon: 'TXT', iconBg: '#555',    iconColor: '#fff', valid: true },
  csv:  { language: 'plaintext',  label: 'CSV',         icon: 'CSV', iconBg: '#89e051', iconColor: '#000', valid: true },
  sql:  { language: 'sql',        label: 'SQL',         icon: '🗄',   iconBg: '#e38c00', iconColor: '#fff', valid: true },

  // Config files (no extension handled by name)
  dockerfile: { language: 'dockerfile', label: 'Dockerfile', icon: '🐳', iconBg: '#2496ed', iconColor: '#fff', valid: true },
  makefile:   { language: 'makefile',   label: 'Makefile',   icon: 'MK', iconBg: '#427819',  iconColor: '#fff', valid: true },
};

// Special filenames with no extension
const SPECIAL_NAMES = {
  dockerfile:    EXTENSION_MAP.dockerfile,
  makefile:      EXTENSION_MAP.makefile,
  '.gitignore':  { language: 'plaintext', label: 'Git Ignore', icon: '🔀', iconBg: '#f1502f', iconColor: '#fff', valid: true },
  '.env':        EXTENSION_MAP.env,
  '.env.local':  EXTENSION_MAP.env,
  '.babelrc':    { language: 'json', label: 'Babel Config', icon: '{}', iconBg: '#f5da55', iconColor: '#000', valid: true },
  '.eslintrc':   { language: 'json', label: 'ESLint Config', icon: '✓', iconBg: '#4b32c3', iconColor: '#fff', valid: true },
};

// Invalid characters in filenames
const INVALID_CHARS = /[<>:"/\\|?*\x00-\x1f]/;

// ─── Validate a filename and return status ────────────────────────────────────
export const validateFileName = (name, existingFiles = []) => {
  const trimmed = name.trim();

  if (!trimmed) {
    return { status: 'empty', message: '', fileInfo: null };
  }

  // Check invalid characters
  if (INVALID_CHARS.test(trimmed)) {
    return {
      status: 'error',
      message: 'Filename contains invalid characters: < > : " / \\ | ? *',
      fileInfo: null,
    };
  }

  // Check for spaces
  if (trimmed.includes(' ') && !trimmed.startsWith('.')) {
    return {
      status: 'warning',
      message: 'Spaces in filenames can cause issues. Consider using hyphens or underscores.',
      fileInfo: null,
    };
  }

  // Check duplicate
  const isDuplicate = existingFiles.some(
    f => f.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (isDuplicate) {
    return {
      status: 'error',
      message: `A file named '${trimmed}' already exists in this room.`,
      fileInfo: null,
    };
  }

  // Special filenames (Dockerfile, Makefile, .gitignore, etc.)
  const specialInfo = SPECIAL_NAMES[trimmed.toLowerCase()];
  if (specialInfo) {
    return { status: 'valid', message: '', fileInfo: specialInfo };
  }

  // Get extension
  const dotIndex = trimmed.lastIndexOf('.');
  if (dotIndex <= 0) {
    // No extension (and not a special name)
    return {
      status: 'error',
      message: `'${trimmed}' is missing a file extension. Try '${trimmed}.js', '${trimmed}.py', etc.`,
      fileInfo: null,
    };
  }

  const ext = trimmed.slice(dotIndex + 1).toLowerCase();

  if (!ext) {
    return {
      status: 'error',
      message: 'Extension cannot be empty. Add an extension like .js or .py',
      fileInfo: null,
    };
  }

  const info = EXTENSION_MAP[ext];
  if (!info) {
    return {
      status: 'unknown',
      message: `Unknown extension '.${ext}' — file will open as plain text.`,
      fileInfo: {
        language: 'plaintext',
        label: `${ext.toUpperCase()} File`,
        icon: ext.slice(0, 3).toUpperCase(),
        iconBg: '#555',
        iconColor: '#fff',
        valid: false,
      },
    };
  }

  // Java: filename must match class name convention
  if (ext === 'java') {
    const baseName = trimmed.slice(0, dotIndex);
    if (!/^[A-Z]/.test(baseName)) {
      return {
        status: 'warning',
        message: `Java class files should start with an uppercase letter (e.g. '${baseName.charAt(0).toUpperCase() + baseName.slice(1)}.java').`,
        fileInfo: info,
      };
    }
  }

  return { status: 'valid', message: '', fileInfo: info };
};

// ─── FileIconBadge ─────────────────────────────────────────────────────────────
const FileIconBadge = ({ fileInfo, size = 28 }) => {
  if (!fileInfo) return (
    <div style={{
      width: size, height: size, borderRadius: 4,
      background: '#3c3c3c', border: '1px dashed #555',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, color: '#666', flexShrink: 0,
    }}>?</div>
  );

  return (
    <div style={{
      width: size, height: size, borderRadius: 4,
      background: fileInfo.iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: fileInfo.icon.length > 2 ? 8 : 13,
      fontWeight: 700, color: fileInfo.iconColor,
      flexShrink: 0, letterSpacing: '-0.5px',
      boxShadow: `0 0 0 1px ${fileInfo.iconBg}44`,
      userSelect: 'none',
    }}>
      {fileInfo.icon}
    </div>
  );
};

// ─── STATUS COLORS ────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  valid:   { border: '#4ec994', text: '#4ec994', bg: 'rgba(78,201,148,0.08)'  },
  warning: { border: '#cca700', text: '#cca700', bg: 'rgba(204,167,0,0.08)'   },
  error:   { border: '#f44747', text: '#f44747', bg: 'rgba(244,71,71,0.08)'   },
  unknown: { border: '#ce9178', text: '#ce9178', bg: 'rgba(206,145,120,0.08)' },
  empty:   { border: '#3c3c3c', text: '#888',    bg: 'transparent'             },
};

// ═════════════════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════════════════
export default function NewFileInput({ existingFiles = [], onCreate, onCancel }) {
  const [value,      setValue]      = useState('');
  const [validation, setValidation] = useState({ status: 'empty', message: '', fileInfo: null });
  const [focused,    setFocused]    = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    setValidation(validateFileName(val, existingFiles));
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) { onCancel?.(); return; }

    const v = validateFileName(trimmed, existingFiles);

    // Allow valid, warning, unknown — block only error and empty
    if (v.status === 'error' || v.status === 'empty') {
      setValidation(v);
      inputRef.current?.focus();
      return;
    }

    onCreate?.(trimmed, v.fileInfo?.language || 'plaintext');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); handleSubmit(); }
    if (e.key === 'Escape') { onCancel?.(); }
  };

  const st = STATUS_STYLE[validation.status] || STATUS_STYLE.empty;
  const canSubmit = validation.status !== 'error' && validation.status !== 'empty';

  return (
    <div style={{
      margin: '4px 8px 6px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── Input row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 6px',
        background: focused ? '#2d2d2d' : '#252526',
        border: `1px solid ${focused ? st.border : '#3c3c3c'}`,
        borderRadius: 4,
        transition: 'border-color 0.15s',
      }}>
        {/* Live file icon preview */}
        <FileIconBadge fileInfo={validation.fileInfo} size={22} />

        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="filename.js"
          spellCheck={false}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#cccccc',
            fontSize: 12,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: 0,
            minWidth: 0,
          }}
        />

        {/* Language pill */}
        {validation.fileInfo && (
          <span style={{
            fontSize: 9, fontWeight: 600,
            color: validation.fileInfo.iconColor,
            background: validation.fileInfo.iconBg,
            borderRadius: 3, padding: '1px 5px',
            flexShrink: 0, letterSpacing: '0.04em',
            opacity: 0.9,
          }}>
            {validation.fileInfo.label}
          </span>
        )}
      </div>

      {/* ── Validation message ── */}
      {validation.message && (
        <div style={{
          marginTop: 4, padding: '4px 7px',
          background: st.bg,
          border: `1px solid ${st.border}44`,
          borderRadius: 3,
          display: 'flex', alignItems: 'flex-start', gap: 5,
        }}>
          <span style={{ fontSize: 11, flexShrink: 0, marginTop: 1 }}>
            {validation.status === 'error'   && '✕'}
            {validation.status === 'warning' && '⚠'}
            {validation.status === 'unknown' && 'ℹ'}
          </span>
          <span style={{ fontSize: 11, color: st.text, lineHeight: 1.4 }}>
            {validation.message}
          </span>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div style={{
        display: 'flex', gap: 4, marginTop: 5, justifyContent: 'flex-end',
      }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: '1px solid #444',
            borderRadius: 3, color: '#888', fontSize: 11,
            padding: '2px 10px', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            background: canSubmit ? '#007acc' : '#3c3c3c',
            border: 'none', borderRadius: 3,
            color: canSubmit ? '#fff' : '#555',
            fontSize: 11, fontWeight: 600,
            padding: '2px 12px', cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
        >
          Create
        </button>
      </div>

      {/* ── Hint ── */}
      <p style={{ fontSize: 10, color: '#555', marginTop: 4, lineHeight: 1.4 }}>
        Enter · Create &nbsp;·&nbsp; Esc · Cancel
      </p>
    </div>
  );
}