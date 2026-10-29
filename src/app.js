import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// IndexRouter
import IndexRouter from "./routes/index.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// index route
app.use("/api/v1", IndexRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toLocaleDateString(),
  });
});

export default app;