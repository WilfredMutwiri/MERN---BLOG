import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()
const app=express();
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