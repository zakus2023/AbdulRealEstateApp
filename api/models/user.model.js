import mongoose from "mongoose";


const userSchemer = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
    avatar:{
        type:Object,
        default: "https://media.licdn.com/dms/image/D4E12AQEud3Ll5MI7cQ/article-inline_image-shrink_1000_1488/0/1660833954461?e=2147483647&v=beta&t=XQNNugxPKxfwFssvJ3-Cv8xowALqbbsm8kJSnveR2aQ",
    },

}, {timestamps:true}); 

const User = mongoose.model('User',userSchemer);

export default User;