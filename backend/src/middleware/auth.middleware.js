import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unathaurized user cannot update anything-no token Provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded)

        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid Token"});
        }
        const user = await User.findById(decoded.userID).select("-password");
        if(!user){
            return res.status(404).json({message:"user not found anywhere"})
        }

         req.user =user;
        next()
    } catch (error) {
        console.log("error in protectRoute middleware:",error.message)
        res.status(500).json({message:"internal server error"})
    }
}