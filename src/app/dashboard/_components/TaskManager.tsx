"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useOptimistic,
  startTransition,
} from "react";
import { TaskCard, TaskItem } from "./TaskCard";
import { TaskFilterBar, FilterStatus } from "./TaskFilterBar";
import { TaskModal } from "./TaskModal";
import {
  ListTodo,
  CheckCircle2,
  Clock3,
  Circle,
  PlusCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message =
          errorData.error?.message ||
          (typeof errorData.error === "string" ? errorData.error : `HTTP error ${res.status}`);
        throw new Error(message);
      }
      const json = await res.json();
      const tasksData = json?.data ?? json;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message =
            errorData.error?.message ||
            (typeof errorData.error === "string" ? errorData.error : `HTTP error ${res.status}`);
          throw new Error(message);
        }
        const json = await res.json();
        const tasksData = json?.data ?? json;
        if (!ignore) {
          setTasks(Array.isArray(tasksData) ? tasksData : []);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load tasks");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Optimistic updates via React 19 useOptimistic
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (
      currentTasks: TaskItem[],
      action:
        | { type: "TOGGLE_STATUS"; id: string; status: "PENDING" | "IN_PROGRESS" | "COMPLETED" }
        | { type: "DELETE"; id: string }
    ) => {
      switch (action.type) {
        case "TOGGLE_STATUS":
          return currentTasks.map((t) =>
            t.id === action.id ? { ...t, status: action.status } : t
          );
        case "DELETE":
          return currentTasks.filter((t) => t.id !== action.id);
        default:
          return currentTasks;
      }
    }
  );

  // Compute status counts using optimisticTasks
  const counts = useMemo(() => {
    return {
      all: optimisticTasks.length,
      pending: optimisticTasks.filter((t) => t.status === "PENDING").length,
      inProgress: optimisticTasks.filter((t) => t.status === "IN_PROGRESS").length,
      completed: optimisticTasks.filter((t) => t.status === "COMPLETED").length,
    };
  }, [optimisticTasks]);

  // Filter tasks based on status and search query
  const filteredTasks = useMemo(() => {
    return optimisticTasks.filter((task) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : task.status === statusFilter;
      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description &&
              task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [optimisticTasks, statusFilter, searchQuery]);

  // Handle Create or Update task submission
  const handleSaveTask = async (data: {
    title: string;
    description?: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    dueDate?: string | null;
    dueTime?: string | null;
  }) => {
    if (editingTask) {
      // UPDATE: PATCH /api/tasks/[id]
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const message =
          errJson.error?.message ||
          (typeof errJson.error === "string" ? errJson.error : "Failed to update task");
        throw new Error(message);
      }
      const resJson = await res.json();
      const updated = resJson?.data ?? resJson;
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      // CREATE: POST /api/tasks
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const message =
          errJson.error?.message ||
          (typeof errJson.error === "string" ? errJson.error : "Failed to create task");
        throw new Error(message);
      }
      const resJson = await res.json();
      const created = resJson?.data ?? resJson;
      setTasks((prev) => [created, ...prev]);
    }
  };

  // Quick toggle status with optimistic UI update via useOptimistic
  const handleToggleStatus = async (
    id: string,
    nextStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    startTransition(async () => {
      // Instantly update UI optimistically
      setOptimisticTasks({ type: "TOGGLE_STATUS", id, status: nextStatus });

      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        });
        if (!res.ok) {
          throw new Error("Failed to update status");
        }
        const resJson = await res.json();
        const updated = resJson?.data ?? resJson;
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch (err) {
        console.error("Status toggle error:", err);
        // Automatic rollback handled by useOptimistic if setTasks is not called
      }
    });
  };

  // Delete task with optimistic UI update via useOptimistic
  const handleDeleteTask = async (id: string) => {
    startTransition(async () => {
      // Instantly remove task from UI optimistically
      setOptimisticTasks({ type: "DELETE", id });

      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Delete task error:", err);
        // Automatic rollback handled by useOptimistic
      }
    });
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <ListTodo className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-100">{counts.all}</p>
        </div>

        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Circle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400">{counts.pending}</p>
        </div>

        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock3 className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400">{counts.inProgress}</p>
        </div>

        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">{counts.completed}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TaskFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        counts={counts}
        onOpenCreateModal={openCreateModal}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
          <p className="text-sm">Loading your tasks...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
          <p className="text-red-400 font-medium mb-3">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              fetchTasks();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Retry
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl text-center">
          <div className="p-4 bg-zinc-800/60 rounded-full mb-4">
            <ListTodo className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-1">
            {searchQuery
              ? "No tasks match your search"
              : statusFilter !== "ALL"
              ? `No ${statusFilter.toLowerCase()} tasks found`
              : "No tasks yet"}
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm mb-6">
            {searchQuery
              ? "Try adjusting your keywords or clearing the search bar."
              : "Get organized by creating your first task with an optional due date and time."}
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
      />
    </div>
  );
};
