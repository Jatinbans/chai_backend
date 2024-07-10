import mongoose, {isValidObjectId} from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { Apierror } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const createTweet = asyncHandler(async(req,res)=>{
    //create tweet

})

const getUserTweets = asyncHandler(async(req,res)=>{
    //create tweet

})

const updateTweet = asyncHandler(async(req,res)=>{
    //create tweet

})

const deleteTweet = asyncHandler(async(req,res)=>{
    //create tweet

})


export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,


}