import jwt from 'jsonwebtoken'
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

export const signup=async(req,res,next)=>{
    const {userName,email,password}=req.body;
    if(!userName ||
        !email ||
        !password ||
        userName===" " ||
        email===" "||
        password===" "
    )
    {
        next(errorHandler(400,"All fields must be filled"))
    }
    const hashPassword=bcryptjs.hashSync(password,10)
    const newUser=new User({
        userName,
        email,
        password:hashPassword
    })

    try {
        await newUser.save()
        res.json("Signup successful")   
    } catch (error) {
     next(error)   
    }
}

export const signin=async(req,res,next)=>{
    // check email and password
    const {email,password}=req.body;
    if(!email || !password || email==="" || password===""){
        next(errorHandler(400,"All fields are required"))
    }
    const validUser=await User.findOne({email})
    if(!validUser){
        return next(errorHandler(404,"User Not Found"))
    }
    const validPassword=bcryptjs.compareSync(password,validUser.password);
    if(!validPassword){
        return next(errorHandler(400,"Invalid Password"))
    }
    const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
    // separate the password from the rest of the respose
    const {password :pass,...rest}=validUser._doc
     res.status(200).cookie('Access_Token',token,{
        httpOnly:true
     }).json(rest)
    try {
        
    } catch (error) {
        next(error)
    }

}

export const google=async(req,res,next)=>{
    const {email,name,googlePhotoURL}=req.body;
    try {
        const user=await User.findOne({email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password,...rest}=user._doc;
            res.status(200).cookie('Access_Token',token,{
                httpOnly:true
             }).json(rest)
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
            const newUser=new User({
                userName:name.toLowerCase().split(' ').join('').Math.random().toString(9).slice(-4),
                email,
                password:hashedPassword,
                profilePicture:googlePhotoURL
            })
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password,...rest}=newUser._doc;
            res
                .status(200)
                .cookie('Access_Token',token,{
                    httpOnly:true
                }).json(rest)
        }
    } catch (error) {
        next(error)
    }
}