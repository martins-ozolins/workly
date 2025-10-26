import express, { type Request, type Response } from "express";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();
const PORT = process.env.PORT || 3000;

// better auth middleware
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
