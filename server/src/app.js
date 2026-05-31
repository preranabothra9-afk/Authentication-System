import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use("/api/auth", authRoutes);

export default app;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Authentication System API is Live"
  });
});