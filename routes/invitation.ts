import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as invitationController from "../controllers/invitationController";

const router = Router();

router.post("/", authMiddleware, invitationController.createInvitation);
router.post(
  "/:id/respond",
  authMiddleware,
  invitationController.respondToInvitation
);
router.get("/user", authMiddleware, invitationController.getUserInvitations);
router.get(
  "/board/:boardId",
  authMiddleware,
  invitationController.getBoardInvitations
);

export default router;
