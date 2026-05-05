import React, { useState } from 'react';
import { Button } from '../Common/Button';
import { Badge } from '../Common/Badge';
import { Tooltip } from '../Common/Badge';

export const EditorHeader = ({
  roomId,
  language,
  onLanguageChange,
  onRunCode,
  isRunning,
  users = [],
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    { id: 'javascript', label: 'JavaScript', icon: '✨' },
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'cpp', label: 'C++', icon: '⚙️' },
    { id: 'java', label: 'Java', icon: '☕' },
    { id: 'csharp', label: 'C#', icon: '#️⃣' },
    { id: 'typescript', label: 'TypeScript', icon: '📘' },
  ];

  return (
    <div className="bg-brand-card border-b border-brand-border px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left: Room Info */}
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4 4 0 00-4-4H4a4 4 0 00-4 4v1h16z" />
              </svg>
              Room: {roomId.substring(0, 20)}...
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-success" />
                </span>
                LIVE
              </Badge>
              <span className="text-xs text-slate-400">{users?.length || 1} Collaborating</span>
            </div>
          </div>

          {/* Copy Room ID */}
          <Tooltip text={copied ? 'Copied!' : 'Copy room ID'}>
            <button
              onClick={handleCopyRoomId}
              className="p-2 rounded-lg bg-brand-dark border border-brand-border text-slate-400 hover:text-slate-200 hover:border-primary-500/50 transition-all"
              title="Copy room ID"
            >
              {copied ? (
                <svg className="w-5 h-5 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Center: Language Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400 font-medium">Language:</label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Run Button */}
        <Button
          variant="success"
          size="lg"
          onClick={onRunCode}
          disabled={isRunning}
          className="shadow-glow hover:shadow-glow-lg"
          icon={() => (
            isRunning ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )
          )}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
