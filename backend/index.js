import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

import { connectDB } from './db/connect-DB.js';

import authRoutes from './routes/auth-routes.js';
import noteRoutes from "./routes/note-routes.js"

dotenv.config();

const app = express();
const port =  3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))

app.use("/api/auth", authRoutes);

app.use("/api/notes", noteRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});