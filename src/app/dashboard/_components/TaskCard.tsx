"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Clock3,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string | null;
  dueTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: TaskItem;
  onToggleStatus: (id: string, nextStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const isCompleted = task.status === "COMPLETED";
  const isInProgress = task.status === "IN_PROGRESS";

  // Cycle status: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
  const getNextStatus = (): "PENDING" | "IN_PROGRESS" | "COMPLETED" => {
    if (task.status === "PENDING") return "IN_PROGRESS";
    if (task.status === "IN_PROGRESS") return "COMPLETED";
    return "PENDING";
  };

  // Format date display
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if overdue
  const isOverdue = (() => {
    if (!task.dueDate || isCompleted) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now;
  })();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? "bg-zinc-950/40 border-zinc-800/50 opacity-70 hover:opacity-100"
          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40"
      }`}
    >
      <div>
        {/* Header: Status badge & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <button
            onClick={() => onToggleStatus(task.id, getNextStatus())}
            className="flex items-center gap-2 group/btn focus:outline-none"
            title="Click to advance status"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 transition-transform group-hover/btn:scale-110" />
            ) : isInProgress ? (
              <Clock3 className="w-5 h-5 text-blue-400 transition-transform group-hover/btn:scale-110 animate-pulse" />
            ) : (
              <Circle className="w-5 h-5 text-zinc-500 group-hover/btn:text-amber-400 transition-all group-hover/btn:scale-110" />
            )}
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : isInProgress
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {task.status.replace("_", " ")}
            </span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Task"
              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-semibold text-base mb-1.5 leading-snug break-words ${
            isCompleted ? "line-through text-zinc-400" : "text-zinc-100"
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-zinc-400 mb-4 whitespace-pre-wrap line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Due Date, Due Time & Overdue Indicator */}
      {(task.dueDate || task.dueTime) && (
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-zinc-800/80 text-xs">
          {task.dueDate && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                isOverdue
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-zinc-800/60 text-zinc-300"
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>{formatDate(task.dueDate)}</span>
              {isOverdue && <span className="font-semibold">(Overdue)</span>}
            </div>
          )}

          {task.dueTime && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/60 text-zinc-300 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{task.dueTime}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
