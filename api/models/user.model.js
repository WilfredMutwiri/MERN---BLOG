import mongoose from "mongoose";
// create schema
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},
{timestamps:true}
);
// create model
const User=mongoose.model('User',userSchema)
// export model
export default User;