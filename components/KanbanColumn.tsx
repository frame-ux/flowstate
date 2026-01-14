'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const columnConfig: Record<TaskStatus, { color: string; icon: string }> = {
  'todo': { color: 'var(--status-todo)', icon: '○' },
  'in-progress': { color: 'var(--status-progress)', icon: '◐' },
  'complete': { color: 'var(--status-complete)', icon: '●' },
};

export function KanbanColumn({ id, title, tasks, onAddTask, onDeleteTask, onEditTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfig[id];

  // Sort tasks by priority (high first)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
  });

  return (
    <div className="flex-1 min-w-[220px] max-w-[320px] flex flex-col">
      {/* Column header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
        <span
          className="text-sm"
          style={{ color: config.color }}
        >
          {config.icon}
        </span>
        <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
            {tasks.length}
          </span>
          <button
            onClick={() => onAddTask(id)}
            className="w-6 h-6 flex items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--accent-warm)] hover:text-[var(--accent-warm)] text-[var(--text-muted)] transition-colors"
            title="Add task (N)"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 transition-colors ${
          isOver
            ? 'bg-[var(--accent-warm-glow)] border border-dashed border-[var(--accent-warm)]'
            : 'bg-[var(--bg-surface)] border border-transparent'
        }`}
        style={{ minHeight: '300px' }}
      >
        <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TaskCard
                  task={task}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              </div>
            ))}
          </div>
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && !isOver && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <div className="w-10 h-10 border border-dotted border-[var(--border-medium)] flex items-center justify-center mb-2">
              <Plus className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Drop here or add
            </p>
          </div>
        )}

        {/* Drop indicator */}
        {isOver && tasks.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="w-full h-16 border-2 border-dashed border-[var(--accent-warm)] bg-[var(--accent-warm-glow)] flex items-center justify-center">
              <span className="text-xs text-[var(--accent-warm)]">Drop here</span>
            </div>
          </div>
        )}
      </div>

      {/* Column footer */}
      <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
          {id.replace('-', ' ')}
        </span>
        <div className="flex gap-1">
          {[...Array(Math.min(tasks.length, 5))].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1"
              style={{ backgroundColor: config.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
