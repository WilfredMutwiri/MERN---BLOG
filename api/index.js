import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js'

dotenv.config()
const app=express();
app.use(express.json())
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