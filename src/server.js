import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import generateRoutes from './routes/generateRoutes.js';

import mongoose from "mongoose";
const app = express();
app.use(bodyParser.json());

const connectDB = async () => {
    try {

        const connection = await mongoose.connect(process.env.MONGO_URI);
        if (connection) console.log("Database has been connected");
    }
    catch (error) {
        console.log("[CONNECTION DATABASE ERROR]", error)
    }
}
await connectDB()
app.use('/', generateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test Data Agent running on port ${PORT}`));
