import mongoose, {isValidObjectId} from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscriptions.models.js";
import { Apierror } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const toggleSubscription = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
}) 
const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
}) 
const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
}) 


export{
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}







