import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorhandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import cookieParser from "cookie-parser";

const app = express();

// Define allowed origins
// const allowedOrigins = [
//   "https://gardening-tips-platform-client-nine.vercel.app",
//   "http://localhost:5173",
//   "http://localhost:3000",

// ];

app.use(
  cors({
    origin: [
      "https://gardening-tips-platform-client-nine.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// CORS options
// const corsOptions: cors.CorsOptions = {
//   origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true); // Allow the requested origin
//     } else {
//       callback(new Error("Not allowed by CORS")); // Reject the origin
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// Parsers
app.use(express.json());
app.use(cookieParser());

// Use CORS middleware
// app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS) - this is automatically handled, but for clarity
// app.options("*", cors(corsOptions));

// Application routes
app.use("/api/v1", router);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("gardening server");
});

// Global error handling middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;
