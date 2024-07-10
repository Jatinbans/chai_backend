import mongoose from "mongoose";
import {Video} from "../models/video.models.js"
import {Subscription} from  "../models/subscriptions.models.js"
import {Like} from "../models/likes.models.js"
import {Apierror} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"


const getChannelStats = asyncHandler(async(req,res)=>{
    //get the channel stats like total video views, total subscribers, total video, total likes etc..
})


const getChannelVideos = asyncHandler(async(req,res)=>{
    //get all the videos uplodaded by the channel
})


export{
    getChannelStats,
    getChannelVideos
}