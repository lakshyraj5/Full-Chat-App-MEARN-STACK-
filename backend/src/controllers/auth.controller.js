import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup= async (req,res)=>{
    const{fullName,email,password} =req.body;
    try {

        if(!fullName || !email || !password){
            return res.status(400).json({message:"all fields are required with data"});
        }

        if(password.length < 8){
            return res.status(400).json({message:"Passwod must be a least 8 character or equal to it "});
        }

        const user =await User.findOne({email});
        if(user) {
            return res.status(400).json({message:"email already exists"});
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            console.log("NewUser",newUser);
            generateToken(newUser._id,res)
            await newUser.save()


            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilepic,

            })
        }
        else{
            res.status(400).json({message:"invalid user data"})
        }
    } catch (error) {
        console.log("Error in signup controller",error.message)
        res.status(500).json({message:"Internal server error"});
    }
};

export const login= async (req,res)=>{
    const {email,password} =req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})

        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"invalid credential"})
        }
        generateToken(user.id,res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })

    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({message:"internal server error"})
    }
};

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logged out successfuly"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};


export const updateProfile = async (res,req)=>{
    try {
        const {profilePic} =req.body
        const userId = req.user._id
        if(!profilePic){
           return res.status(400).json({message:"no profilepic provided"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in the updateProfile:",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller",error.message)
        res.status(500).json({message:"Internal server error"});
    }
}