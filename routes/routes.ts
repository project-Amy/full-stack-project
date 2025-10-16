import { Router } from "express";
import boardRoutes from "./board";
import invitationRoutes from "./invitation";

const routes = Router();

routes.use("/boards", boardRoutes);
routes.use("/invitations", invitationRoutes);

export default routes;