import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorhandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import cookieParser from "cookie-parser";
import config from "./config";
import connectDB from "./config/db";

const app = express();

const allowedOrigins = new Set(
  [
    config.frontend_base_url,
    config.client_origin,
    ...config.client_origins,
    "https://gardening-tips-platform-client-nine.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5173",
  ].filter(Boolean),
);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const ensureDatabaseConnection = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Parsers
app.use(express.json());
app.use(cookieParser());

// Application routes
app.use("/api/v1", ensureDatabaseConnection, router);

// Test route
app.get("/", (_req: Request, res: Response) => {
  res.send("gardening server");
});

// Global error handling middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;
