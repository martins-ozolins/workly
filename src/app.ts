import express, { type Request, type Response } from "express";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

const app = express();

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json());

// better auth middleware
app.all("/api/auth/*splat", toNodeHandler(auth));

// routes

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

export default app;
