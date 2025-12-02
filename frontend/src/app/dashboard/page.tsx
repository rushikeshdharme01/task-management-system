"use client";

import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTask,
} from "@/lib/api";
import { useRouter } from "next/navigation";

type Task = {
  id: number;
  title: string;
  status: string;
};

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "pending" | "completed">("");
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const loadTasks = async (pageToLoad = page) => {
    try {
      const res = await getTasks({
        page: pageToLoad,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: status || undefined,
      });

      const list = res.data as Task[];
      setTasks(list);
      setPage(pageToLoad);
      setIsLastPage(list.length < PAGE_SIZE);
    } catch (err) {
      // Agar token invalid ho ya user logged-in na ho to login pe bhejo
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    loadTasks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    setLoadingAdd(true);
    try {
      await createTask({ title });
      setTitle("");
      // nayi task hamesha current filters pe load ho
      loadTasks(1);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    router.push("/auth/login");
  };

  const handleApplyFilters = () => {
    loadTasks(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      loadTasks(page - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      loadTasks(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Task Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-red-600 text-white text-sm"
          >
            Logout
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded shadow p-3 flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">
              Search by title
            </label>
            <input
              className="w-full border rounded p-2 text-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Status
            </label>
            <select
              className="border rounded p-2 text-sm"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "" | "pending" | "completed")
              }
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm h-9 sm:h-10"
          >
            Apply
          </button>
        </div>

        {/* Add Task */}
        <div className="bg-white rounded shadow p-3 flex gap-2">
          <input
            className="flex-1 border rounded p-2 text-sm"
            placeholder="New task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={handleAdd}
            disabled={loadingAdd}
            className="px-4 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-60"
          >
            {loadingAdd ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Task list */}
        <div className="bg-white rounded shadow p-3 space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500">
              No tasks found. Try changing filters or add a new one.
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <p
                    className={`font-medium ${
                      task.status === "completed"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{task.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await toggleTask(task.id);
                      loadTasks(page);
                    }}
                    className="px-2 py-1 text-xs rounded bg-blue-600 text-white"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={async () => {
                      await deleteTask(task.id);
                      // agar last item delete ho jaye, page adjust kar sakte ho
                      loadTasks(page);
                    }}
                    className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm">
          <div>
            Page <span className="font-semibold">{page}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={isLastPage}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
