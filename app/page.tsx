'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, TodoItem } from '@/types';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TodoList } from '@/components/TodoList';
import { NoteArea } from '@/components/NoteArea';

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('vibeboard-tasks', []);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('vibeboard-todos', []);
  const [notes, setNotes] = useLocalStorage<string>('vibeboard-notes', '');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative border-b border-[var(--border-subtle)] px-6 py-5">
        <div className="flex items-baseline gap-4">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            FlowStack
          </h1>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            v1.0
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--text-muted)] tracking-wide">
          Progress Not Perfection
        </p>

        {/* Decorative corner marks */}
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--border-medium)]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[var(--border-medium)]" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar - Todo List */}
        <aside className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] p-5 flex flex-col">
          <TodoList todos={todos} onTodosChange={setTodos} />
        </aside>

        {/* Center - Kanban Board */}
        <section className="flex-1 p-5 overflow-x-auto min-h-[400px]">
          <KanbanBoard tasks={tasks} onTasksChange={setTasks} />
        </section>

        {/* Right Sidebar - Notes */}
        <aside className="w-full lg:w-[300px] border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] p-5 flex flex-col">
          <NoteArea notes={notes} onNotesChange={setNotes} />
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] px-6 py-3 flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-muted)] tracking-wide uppercase">
          Local Storage • Auto-saved
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-complete)] animate-pulse" />
          <span className="text-[10px] text-[var(--text-muted)]">synced</span>
        </div>
      </footer>
    </div>
  );
}
