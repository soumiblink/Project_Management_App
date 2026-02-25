'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ITaskWithDetails, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KanbanBoardProps {
  tasks: ITaskWithDetails[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: ITaskWithDetails) => void;
  onDeleteTask: (taskId: string) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function KanbanBoard({ tasks, onTaskMove, onEditTask, onDeleteTask }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    onTaskMove(draggableId, newStatus);
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const columnColors = {
            'todo': 'from-slate-600 to-slate-700',
            'in-progress': 'from-amber-600 to-orange-600',
            'done': 'from-green-600 to-emerald-600',
          };
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`bg-gradient-to-r ${columnColors[column.id]} rounded-t-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>
              <div className="flex-1 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 border-t-0 rounded-b-xl p-4">
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-lg">
                      <p className="text-slate-500 text-sm">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const columnColors = {
            'todo': 'from-slate-600 to-slate-700',
            'in-progress': 'from-amber-600 to-orange-600',
            'done': 'from-green-600 to-emerald-600',
          };
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${columnColors[column.id]} rounded-t-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 border-t-0 rounded-b-xl p-4">
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[400px] transition-all duration-200 ${
                        snapshot.isDraggingOver ? 'bg-cyan-500/10 rounded-lg p-2' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-all duration-200 ${
                                snapshot.isDragging ? 'opacity-70 rotate-2 scale-105' : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {/* Empty state */}
                      {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-lg">
                          <p className="text-slate-500 text-sm">No tasks</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
