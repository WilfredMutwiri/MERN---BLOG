import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
dotenv.config()
const app=express();
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.listen(process.env.PORT,()=>{
    console.log(`Listening on port ${process.env.PORT}`);
})
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to db successfully!");
    })
    .catch((error)=>{
        console.log(error);
    })
// test api
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
// middleware
app.use((err,req,res,next)=>{
const statusCode=err.statusCode || 500;
const message=err.message || "Internal Server Error";
res.status(statusCode).json({
    success:false,
    statusCode,
    message
})
})