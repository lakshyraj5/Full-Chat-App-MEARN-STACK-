import User from "../models/user.model.js"
import Message from "../models/message.model.js";

export const getUsersForSidebar =async(req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("error in get usersforsidebar",error.message)
        res.status(500).json({error:"Internal server error"})
    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const MyId= req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:MyId , recieverId:userToChatId },
                {senderId:userToChatId , recieverId:MyId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages function in message.controllers:" , error.message);
        res.status(500).json({error:"Internal error in server"});
    }
}

export const sendMessages =async(req,res)=>{
    try {
        const {text , image} =req.body;
        const {id:recieverId} =req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse =await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
        }
        
        const newMessage= new Message({
            senderId,
            recieverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        res.status(201).json(newMessage)
        
    } catch (error) {
        console.log("Error in the sendMessages function in message controller:",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}