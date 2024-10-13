import express, { Request, Response } from "express";
import cors from 'cors';
import globalErrorHandler from "./middlewares/globalErrorhandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import cookieParser from 'cookie-parser';

const app = express();

//parsers
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://gardening-tips-platform-client-nine.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Check if the incoming origin is in the allowedOrigins array or if origin is undefined (for non-browser requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
}));

// application routes
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  res.send('gardening server');
};

app.get('/', test);

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
