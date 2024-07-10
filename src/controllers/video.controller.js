import mongoose, {isValidObjectId} from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { Apierror } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async(req,res)=>{
    const {page = 1, limit = 10, query, sortBy, sortType, userid} = req.query
    //get all videos bases on query, sort, pagination
})

const publishVideo = asyncHandler(async(req,res)=>{
    const {title, description} = req.body
    //get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    //get video by id
})

const updateVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    //update video details like title, description, thumnbnail
})


const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    //delete video
})

const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
})

export{
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,

}