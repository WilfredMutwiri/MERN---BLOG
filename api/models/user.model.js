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
    },
    profilePicture:{
        type:String,
        default:'https://th.bing.com/th/id/R.21cada1e782b775985ef28a2d44e26b8?rik=ItEoM3VGzOmHSg&pid=ImgRaw&r=0'
    }
},
{timestamps:true}
);
// create model
const User=mongoose.model('User',userSchema)
// export model
export default User;