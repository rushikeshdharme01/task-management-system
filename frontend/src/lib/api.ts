import api from "./axiosInstance";

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const getTasks = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => api.get("/tasks", { params });

export const createTask = (data: { title: string; description?: string }) =>
  api.post("/tasks", data);

export const updateTask = (id: number, data: any) =>
  api.patch(`/tasks/${id}`, data);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

export const toggleTask = (id: number) => api.patch(`/tasks/${id}/toggle`);
