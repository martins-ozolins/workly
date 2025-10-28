import cors from "cors";

//["http://localhost:5173", "http://localhost:3000"]
export const corsMiddleware = cors({
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
