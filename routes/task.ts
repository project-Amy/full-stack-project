import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as taskController from "../controllers/taskController";

const router = Router();

router.post("/", authMiddleware, taskController.createTask);
router.get("/board/:boardId", authMiddleware, taskController.getBoardTasks);
router.get("/:id", authMiddleware, taskController.getTask);
router.patch("/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

export default router;
