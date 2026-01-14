'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TodoItem } from '@/types';

interface TodoListProps {
  todos: TodoItem[];
  onTodosChange: (todos: TodoItem[]) => void;
}

export function TodoList({ todos, onTodosChange }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;

    const todo: TodoItem = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
    };

    onTodosChange([...todos, todo]);
    setNewTodo('');
  };

  const handleToggle = (id: string) => {
    onTodosChange(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    onTodosChange(todos.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Quick Tasks
          </h2>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
            {activeTodos.length} remaining
          </p>
        </div>
        <div className="w-6 h-6 border border-dotted border-[var(--border-medium)] flex items-center justify-center">
          <span className="text-xs text-[var(--text-muted)]">{todos.length}</span>
        </div>
      </div>

      {/* Add new todo */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add task..."
          className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-warm)] transition-colors"
        />
        <button
          onClick={handleAddTodo}
          className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-warm)] hover:text-[var(--accent-warm)] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Todo list */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {activeTodos.map((todo, index) => (
          <div
            key={todo.id}
            className="group flex items-start gap-3 p-2.5 bg-[var(--bg-surface)] border-l-2 border-l-[var(--accent-warm)] hover:bg-[var(--bg-elevated)] transition-colors animate-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <button
              onClick={() => handleToggle(todo.id)}
              className="mt-0.5 w-4 h-4 border border-[var(--border-strong)] flex items-center justify-center hover:border-[var(--accent-warm)] transition-colors flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 bg-transparent group-hover:bg-[var(--accent-warm-glow)]" />
            </button>
            <span className="flex-1 text-sm text-[var(--text-primary)] leading-snug break-words">
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--accent-warm)] transition-all text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}

        {/* Completed section */}
        {completedTodos.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Done ({completedTodos.length})
              </span>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>

            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-start gap-3 p-2.5 opacity-50 hover:opacity-75 transition-opacity"
              >
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="mt-0.5 w-4 h-4 border border-[var(--border-medium)] bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-[10px] text-[var(--status-complete)]">✓</span>
                </button>
                <span className="flex-1 text-sm text-[var(--text-muted)] line-through leading-snug break-words">
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--accent-warm)] transition-all text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-8 h-8 border border-dotted border-[var(--border-medium)] mb-3" />
            <p className="text-xs text-[var(--text-muted)]">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
