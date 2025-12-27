import express from 'express';
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

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});