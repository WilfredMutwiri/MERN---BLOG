import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'

export const signup=async(req,res)=>{
    const {userName,email,password}=req.body;
    if(!userName || !email || !password ||userName===" " || email===" "|| password===" "){
        return res.status(400).json({message:"All fields must be filled"})
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
      res.status(500).json({message:error.message})  
    }
}