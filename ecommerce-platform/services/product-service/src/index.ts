import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiRoute from './routes/index';
import { connectDB } from "./models/database/connection";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();


app.use(cors());
app.use(express.json());


app.use("/api", ApiRoute);

app.use((req, res, next) => {
    throw new Error('Route not found');
});

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});