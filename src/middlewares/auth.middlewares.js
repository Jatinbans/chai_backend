import { Apierror } from "../utils/Apierror";
import { asyncHandler } from "../utils/asynchandler";
import jwt from "jsonwebtoken"
import {User} from "../models/user.models"

//verify user hai ya nhi
export const verifyJWT = asyncHandler(async (req,_,next)=>{
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
     if(!token){
         throw new Apierror(401,"unauthorization request")
     }
 
     const  decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("password -refreshToken")
     if(!user){
         throw new Apierror(401,"invalid access token")
     }
 
     req.user = user;
     next()
   } catch (error) {
    throw new Apierror(401,error?.message || "invalid access token")
   }

})