'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'complete', title: 'Complete' },
];

export function KanbanBoard({ tasks, onTasksChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // N - New task in todo column
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setModalStatus('todo');
      }

      // 1, 2, 3 - Add to specific column
      if (e.key === '1') {
        e.preventDefault();
        setModalStatus('todo');
      }
      if (e.key === '2') {
        e.preventDefault();
        setModalStatus('in-progress');
      }
      if (e.key === '3') {
        e.preventDefault();
        setModalStatus('complete');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;

    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn && activeTask.status !== overColumn.id) {
      onTasksChange(
        tasks.map((t) =>
          t.id === activeTask.id ? { ...t, status: overColumn.id } : t
        )
      );
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      onTasksChange(
        tasks.map((t) =>
          t.id === activeTask.id ? { ...t, status: overTask.status } : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const columnTasks = getTasksByStatus(activeTask.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== newIndex) {
        const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        const otherTasks = tasks.filter((t) => t.status !== activeTask.status);
        onTasksChange([...otherTasks, ...reorderedColumnTasks]);
      }
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(null);
    setModalStatus(status);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalStatus(task.status);
  };

  const handleCreateTask = (title: string, description: string | undefined, priority: TaskPriority) => {
    if (!modalStatus) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      status: modalStatus,
      createdAt: Date.now(),
    };

    onTasksChange([...tasks, newTask]);
    setModalStatus(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onTasksChange(
      tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setModalStatus(null);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    onTasksChange(tasks.filter((t) => t.id !== id));
  };

  const handleCloseModal = () => {
    setModalStatus(null);
    setEditingTask(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 h-full">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          ))}
        </div>

        {/* Drag overlay for smooth dragging */}
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105">
              <TaskCard task={activeTask} onDelete={() => {}} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add/Edit task modal */}
      <AddTaskModal
        isOpen={modalStatus !== null}
        onClose={handleCloseModal}
        onSubmit={handleCreateTask}
        onUpdate={handleUpdateTask}
        columnName={modalStatus ? columns.find(c => c.id === modalStatus)?.title || '' : ''}
        editingTask={editingTask}
      />

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 text-[10px] text-[var(--text-muted)] opacity-50 hidden lg:block">
        <span className="px-1.5 py-0.5 border border-[var(--border-subtle)] mr-1">N</span>
        <span>New task</span>
        <span className="mx-2">•</span>
        <span className="px-1.5 py-0.5 border border-[var(--border-subtle)] mr-1">1</span>
        <span className="px-1.5 py-0.5 border border-[var(--border-subtle)] mr-1">2</span>
        <span className="px-1.5 py-0.5 border border-[var(--border-subtle)] mr-1">3</span>
        <span>Add to column</span>
      </div>
    </>
  );
}
