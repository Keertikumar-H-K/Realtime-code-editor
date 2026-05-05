const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'cpp', name: 'C++', icon: 'C++' },
  { id: 'java', name: 'Java', icon: 'JV' },
  { id: 'c', name: 'C', icon: 'C' },
  { id: 'go', name: 'Go', icon: 'GO' },
  { id: 'rust', name: 'Rust', icon: 'RS' },
  { id: 'typescript', name: 'TypeScript', icon: 'TS' }
];

const LanguageSelector = ({ language, onChange }) => {
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-3 py-1.5 pr-8 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;