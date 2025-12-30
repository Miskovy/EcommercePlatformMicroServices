import express, { Request , Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiRoute from './routes/index';
import { connectDB } from "./models/database/connection";
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json({ limit: '15mb' })); // Increase limit to handle images
app.use(express.urlencoded({ limit: '10mb', extended: true }));



app.use("/api", ApiRoute);

app.use((req, res, next) => {
    throw new Error('Route not found');
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log for debugging

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
        // Optional: Send stack trace only in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});