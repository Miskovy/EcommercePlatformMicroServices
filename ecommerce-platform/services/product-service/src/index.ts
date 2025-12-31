import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiRoute from './routes/index';
import { connectDB } from "./models/database/connection";
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate Limiter Configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});

connectDB();

// 1. Security Headers (Helmet)
// Note: We explicitly allow cross-origin resource sharing for your images
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// 2. CORS
app.use(cors());

// 3. Body Parsing (Move this UP before routes/sanitization)
// ⚠️ ONLY define this once. The 'limit' option is applied here.
app.use(express.json({ limit: '15mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Data Sanitization (Must come AFTER body parsing)
// app.use(mongoSanitize());

app.use((req: Request, res: Response, next: NextFunction) => {
    // 1. Sanitize Body (POST/PUT data)
    if (req.body) {
        mongoSanitize.sanitize(req.body);
    }

    // 2. Sanitize Query Params (?search=...)
    // We modify keys inside req.query instead of overwriting the whole object
    if (req.query) {
        mongoSanitize.sanitize(req.query);
    }

    // 3. Sanitize Route Params (:id)
    if (req.params) {
        mongoSanitize.sanitize(req.params);
    }

    next();
});

// 5. Rate Limiting
app.use(limiter);

// 6. Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 7. Routes
app.use("/api", ApiRoute);

// 8. 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Route not found');
    (error as any).statusCode = 404;
    next(error);
});

// 9. Global Error Handler
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

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});