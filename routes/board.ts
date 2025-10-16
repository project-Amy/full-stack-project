import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as boardController from "../controllers/boardController";

const router = Router();

router.get("/", authMiddleware, boardController.getAllBoards);
router.post("/", authMiddleware, boardController.createBoard);
router.get("/:id", authMiddleware, boardController.getBoard);

export default router;
