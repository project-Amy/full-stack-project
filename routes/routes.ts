import { Router } from "express";
import boardRoutes from "./board";

const routes = Router();

routes.use("/boards", boardRoutes);

export default routes;