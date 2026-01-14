'use client';

import { useEffect, useRef, useState } from 'react';

interface NoteAreaProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function NoteArea({ notes, onNotesChange }: NoteAreaProps) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalNotes(value);
    setIsSaving(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onNotesChange(value);
      setIsSaving(false);
    }, 400);
  };

  const wordCount = localNotes.trim() ? localNotes.trim().split(/\s+/).length : 0;
  const charCount = localNotes.length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Notes
          </h2>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
            Scratch pad
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-[10px] text-[var(--accent-warm)] animate-pulse">
              saving...
            </span>
          )}
          <div className="w-6 h-6 border border-dotted border-[var(--border-medium)] flex items-center justify-center">
            <span className="text-[10px] text-[var(--text-muted)]">✎</span>
          </div>
        </div>
      </div>

      {/* Text area with paper-like styling */}
      <div className="flex-1 relative">
        {/* Line numbers gutter effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col items-center pt-3 text-[10px] text-[var(--text-muted)] leading-[1.65rem] overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => (
            <span key={i} className="opacity-30">{i + 1}</span>
          ))}
        </div>

        <textarea
          value={localNotes}
          onChange={handleChange}
          placeholder="Write your notes, ideas, and thoughts here...

// Use this space for:
// - Quick ideas
// - Code snippets
// - Meeting notes
// - Anything else"
          className="w-full h-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 resize-none focus:outline-none focus:border-[var(--accent-warm)] transition-colors leading-relaxed"
          spellCheck={false}
          style={{
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.65rem'
          }}
        />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[var(--text-muted)]">
            {wordCount} words
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            {charCount} chars
          </span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
          Mono
        </span>
      </div>
    </div>
  );
}
