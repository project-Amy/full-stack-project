import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes/routes";
import { corsOptions } from "./config/corsOptions";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Hello world" });
});

app.get("/health", (_: Request, res: Response) => {
  res.json({
    status: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes)

app.use((_: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server in esecuzione su http://localhost:${PORT}`);
});
