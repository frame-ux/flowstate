'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, TaskPriority } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string | undefined, priority: TaskPriority) => void;
  onUpdate?: (task: Task) => void;
  columnName: string;
  editingTask?: Task | null;
}

const priorities: { value: TaskPriority; label: string; icon: string; color: string }[] = [
  { value: 'high', label: 'High', icon: '▲', color: '#ef4444' },
  { value: 'medium', label: 'Medium', icon: '◆', color: 'var(--accent-warm)' },
  { value: 'low', label: 'Low', icon: '▽', color: 'var(--text-muted)' },
];

export function AddTaskModal({ isOpen, onClose, onSubmit, onUpdate, columnName, editingTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingTask;

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description || '');
        setPriority(editingTask.priority || 'medium');
      } else {
        setTitle('');
        setDescription('');
        setPriority('medium');
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, editingTask]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && editingTask && onUpdate) {
      onUpdate({
        ...editingTask,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
    } else {
      onSubmit(title.trim(), description.trim() || undefined, priority);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[var(--bg-deep)] border border-[var(--border-medium)] shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              {isEditing ? 'Edit Task' : 'New Task'}
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
              {isEditing ? `Editing in ${columnName}` : `Adding to ${columnName}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-warm)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Title input */}
            <div>
              <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Title *
              </label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-warm)] transition-colors"
              />
            </div>

            {/* Priority selector */}
            <div>
              <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border transition-all ${
                      priority === p.value
                        ? 'border-[var(--accent-warm)] bg-[var(--accent-warm-glow)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    <span style={{ color: p.color }} className="text-xs">
                      {p.icon}
                    </span>
                    <span className={`text-xs ${priority === p.value ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description input */}
            <div>
              <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Description <span className="opacity-50">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-warm)] resize-none transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-subtle)]">
            <span className="text-[10px] text-[var(--text-muted)]">
              Press Enter to save
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-5 py-2 text-sm bg-[var(--accent-warm)] text-[var(--bg-deep)] font-medium hover:bg-[var(--accent-warm-dim)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[var(--border-medium)]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[var(--border-medium)]" />
      </div>
    </div>
  );
}
