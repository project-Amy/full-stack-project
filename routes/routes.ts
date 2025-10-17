import { Router } from "express";
import boardRoutes from "./board";
import invitationRoutes from "./invitation";
import taskRoutes from "./task";
import userRoutes from "./user";

const routes = Router();

routes.use("/boards", boardRoutes);
routes.use("/invitations", invitationRoutes);
routes.use("/tasks", taskRoutes);
routes.use("/users", userRoutes);

export default routes;