import { Router, Request, Response } from "express";
import { prisma } from "./prisma";
import { authMiddleware } from "./middleware/authMiddleware";

const router = Router();

// GET /tasks?search=&status=&page=&limit=
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { search = "", status = "", page = "1", limit = "10" } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

const tasks = await prisma.task.findMany({
  where: {
    userId: req.userId!,
    // search diya hai to filter karega, warna ignore karega
    ...(search
      ? {
          title: {
            contains: search as string, // case-sensitive search
          },
        }
      : {}),
    ...(status
      ? {
          status: status as string,
        }
      : {}),
  },
  skip: (pageNum - 1) * limitNum,
  take: limitNum,
  orderBy: { createdAt: "desc" },
});


    return res.json(tasks);
  } catch (err) {
    console.error("Get tasks error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /tasks
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error("Create task error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /tasks/:id
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.json(task);
  } catch (err) {
    console.error("Get task error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /tasks/:id
router.patch("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    const { title, description, status } = req.body;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ message: "Task not found" });

    const updated = await prisma.task.update({
      where: { id },
      data: { title, description, status },
    });

    return res.json(updated);
  } catch (err) {
    console.error("Update task error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /tasks/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ message: "Task not found" });

    await prisma.task.delete({ where: { id } });

    return res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /tasks/:id/toggle
router.patch(
  "/:id/toggle",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const id = Number(req.params.id);

      const existing = await prisma.task.findFirst({ where: { id, userId } });
      if (!existing) {
        return res.status(404).json({ message: "Task not found" });
      }

      const newStatus = existing.status === "pending" ? "completed" : "pending";

      const updated = await prisma.task.update({
        where: { id },
        data: { status: newStatus },
      });

      return res.json(updated);
    } catch (err) {
      console.error("Toggle task error", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
