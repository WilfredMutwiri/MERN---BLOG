import jwt from 'jsonwebtoken'

import {errorHandler} from './error.js';
export const verifyToken=(req,res,next)=>{
    const token=req.cookies.access_token;
    if(token){
        console.log("Token found");
    }
    if(!token){
        console.log("No token found");
        return next(errorHandler(401,'You are not authorized'))
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401,'You are not authorized'))
        }
        req.user=user;
        next();
    });    
}