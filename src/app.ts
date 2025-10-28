import express, { type Request, type Response } from "express";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { corsMiddleware } from "./shared/middleware/cors.middleware.js";
import { errorHandler } from "./shared/middleware/error.middleware.js";
import { requireAuth } from "./shared/middleware/auth.middleware.js";

// Feature routes
import userRoutes from "./features/users/user.routes.js";
import organisationRoutes from "./features/organisations/organisation.routes.js";
import memberRoutes from "./features/members/member.routes.js";

const app = express();

// middleware
app.use(corsMiddleware);

// better auth middleware
app.all("/api/auth/*splat", toNodeHandler(auth));

// Better auth requires this to be after better auth middleware
app.use(express.json());

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

// API routes (protected by auth middleware)
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/organisations", requireAuth, organisationRoutes);
app.use("/api/members", requireAuth, memberRoutes);
// app.use("/api/documents", requireAuth, documentRoutes);

// Error handler must be last
app.use(errorHandler);

export default app;
