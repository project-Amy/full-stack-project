import { Router } from "express";
import boardRoutes from "./board";
import invitationRoutes from "./invitation";
import taskRoutes from "./task";

const routes = Router();

routes.use("/boards", boardRoutes);
routes.use("/invitations", invitationRoutes);
routes.use("/tasks", taskRoutes);

export default routes;