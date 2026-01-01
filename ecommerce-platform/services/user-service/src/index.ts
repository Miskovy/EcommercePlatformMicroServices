import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiRoute from './routes/index';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import prisma from './config/prisma';

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`[User Service] Request Received: ${req.method} ${req.url}`);
  console.log(`[User Service] Body:`, req.body);
  next();
});

const PORT = process.env.PORT || 3002;

// Rate Limiter Configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(express.json({ limit: '15mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/", ApiRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Route not found');
    (error as any).statusCode = 404;
    next(error);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, async () => {
    console.log(`User Service running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL Database');
  } catch (error) {
    console.error('Database connection failed', error);
  }
});