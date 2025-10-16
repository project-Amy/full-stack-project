import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as taskController from "../controllers/taskController";

const router = Router();

router.post("/", authMiddleware, taskController.createTask);
router.get("/:id", authMiddleware, taskController.getTask);
router.patch("/:id", authMiddleware, taskController.updateTask);

export default router;
