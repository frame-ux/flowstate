'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority } from '@/types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  high: { label: 'High', color: '#ef4444', icon: '▲' },
  medium: { label: 'Medium', color: 'var(--accent-warm)', icon: '◆' },
  low: { label: 'Low', color: 'var(--text-muted)', icon: '▽' },
};

const statusColors = {
  'todo': 'var(--status-todo)',
  'in-progress': 'var(--status-progress)',
  'complete': 'var(--status-complete)',
};

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority || 'medium'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] cursor-grab active:cursor-grabbing card-lift ${
        isDragging ? 'opacity-60 shadow-xl rotate-2' : ''
      }`}
      {...attributes}
      {...listeners}
      onDoubleClick={(e) => {
        e.preventDefault();
        onEdit(task);
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: statusColors[task.status] }}
      />

      {/* Priority indicator */}
      <div
        className="absolute top-2 left-2 flex items-center gap-1"
        title={`${priority.label} priority`}
      >
        <span className="text-[10px]" style={{ color: priority.color }}>
          {priority.icon}
        </span>
      </div>

      {/* Card content */}
      <div className="p-3 pt-6 pr-8">
        <p className="text-sm text-[var(--text-primary)] leading-snug break-words">
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed break-words line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer with timestamp and priority label */}
      <div className="px-3 pb-2 flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-muted)] opacity-50">
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span
          className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border"
          style={{
            color: priority.color,
            borderColor: priority.color,
            opacity: (task.priority || 'medium') === 'low' ? 0.5 : 1
          }}
        >
          {priority.label}
        </span>
      </div>

      {/* Action buttons */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-warm)] hover:bg-[var(--bg-elevated)] transition-all"
          title="Edit task"
        >
          <span className="text-[10px]">✎</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-elevated)] transition-all"
          title="Delete task"
        >
          <span className="text-sm">×</span>
        </button>
      </div>

      {/* Corner decoration */}
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[var(--border-subtle)] opacity-30" />

      {/* Double-click hint */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-0 pointer-events-none">
        <span className="text-[10px] text-white/70">Double-click to edit</span>
      </div>
    </div>
  );
}
