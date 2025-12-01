import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import taskRoutes from "./tasks";

const app = express();

app.use(cors());
app.use(express.json());

import type { Request, Response } from "express";

app.get("/", (_req: Request, res: Response) => {
  res.send("Task Management API is running");
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
