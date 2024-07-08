import { asyncHandler } from "../utils/asynchandler.js";
import {Apierror} from "../utils/Apierror.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";
import { response } from "express";
import { jwt } from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(userId) =>
{
    try {
        const user = await User.findById(userId)
        const accessToekn = user.generateAccessToken()
        const refreshToekn = user.generateRefreshToken()

        user.refreshToekn = refreshToekn
        await user.save({validateBeforeSave: false})

        return {accessToekn,refreshToekn}
        
    } catch (error) {
        throw new Apierror(500,"something went wrong while generating refresh and access token")
        
    }
}

const registerUser = asyncHandler(async (req,res) =>{
    //get user details from frontend(postman)
    //validation - not empty
    //check if user already exists: username, email
    //check for images,check for avatar
    //upload them to cloudinary, avatar check
    //create user object - create entry in db
    //remove password and refresh token from response
    //check for the user creation
    //return response

     // if(fullname === ""){
    //     throw new Apierror(400,"fullname is required")
    // }

    const {fullname,email,username,password} = req.body
    // console.log("email:",email);

    if(
        [fullname,email,username,password].some((field)=> 
        field?.trim() === "")
    ) {
        throw new Apierror(400,"all fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new Apierror(409,"user with email or username already exists")
    }
    console.log(req.files);


    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath =req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new Apierror(400,"avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new Apierror(400,"avatar file is required")
    }
   
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url|| "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToekn"
    )

    if(!createdUser){
        throw new Apierror(500,"something went wrong while registering")
    }
    
    return res.status(200).json(
       new ApiResponse(200,createdUser,"user registered successfully")
    )



})


const loginUser = asyncHandler(async (req,res) =>{
    // get user login details req-body -> data
    //validate the details from user
    // password check
    //access and refresh token 
    //send cookie 

    const{email,username,password} = req.body

    if(!username || !email){
        throw new Apierror(400,"username or password is required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new Apierror(404,"user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new Apierror(401,"password is not correct")
    }

    const {accessToekn,refreshToekn}= await generateAccessAndRefreshTokens(user._id)

    //send to cookies
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToekn,options)
    .cookie("refreshToken",refreshToekn,options)
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,accessToekn,refreshToekn

            },
            "User logged in successfully"
        )
    )
   
})


const logoutUser = asyncHandler(async (req,res)=>{
    //clear cookies
    // reset refresh token
    await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
        refreshToekn : undefined
        }
    },
    {
        new:true
    },

    )
    const options = {
        httpOnly :true,
        secure:true
    }
    return response.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logout successfully"))
})


const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToekn ||  req.body.refreshToekn

    if(!incomingRefreshToken){
        throw new Apierror(401,"unauthorized request")
    }

 try {
       const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   
       const user = await User.findById(decodedToken?._id)
       if(!user){
           throw new Apierror(401,"invalid refresh token")
       }
   
       if(incomingRefreshToken!==user?.refreshToekn){
           throw new Apierror(401,"refresh token is expired or used")
       }
   
       const options={
           httpOnly:true,
           secure:true
       }
      const{accessToekn,newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
       return res
       .status(200)
       .cookie("accessToken",accessToekn,options)
       .cookie("refreshToken",newRefreshToken,options)
       .json(
           new ApiResponse(
               200,
               {accessToekn,refreshToekn:newRefreshToken},
               "access token refreshed"
           )
       )
 } catch (error) {
    throw new Apierror(401,error?.message || "invalid refresh token")
 }

})

const chnageCurrentPassword = asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new Apierror(400,"Invalid old password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false})

    return res.status(200)
    .json(new ApiResponse(200,{},"Password chnaged successfully"))

})

const getcurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(200,req.user,"current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname,email} = req.body

    if(!fullname || !email){
        throw new Apierror(400,"all fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname:fullname,
                email:email

            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new Apierror(400,"avatar file is missing")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new Apierror(400,"error while uploading avatar")
    }

   const user =  await user.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}

    
    ).select("-password")
    return res.status(200)
    .json(new ApiResponse(200,user,"avatar updated successfully"))
})
const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new Apierror(400,"avatar file is missing")
    }
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new Apierror(400,"error while uploading coverImage")
    }

    const user = await user.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}

    
    ).select("-password")

    return res.status(200)
    .json(new Apierror(200,user,"coverImage updated successfully"))
})

const getUserChannelProfile = asyncHandler(async(rrq,res)=>{
    const {username} = req.params
    if(!username?.trim()){
        throw new Apierror(400,"username is missing")
    }

   const channel = await User.aggregate([
    //pipleines
    {
        $match:{
            username:username?.toLowerCase()
        }
    },
    {
           //subscribers
        $lookup:{
            from: "subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"

        }
    },
    {
        //subscribedTo
        $lookup:{
            from: "subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },

    {
        $addFields:{
            subscribersCount: {
                $size:"$subscribers"
            },
            channelsSubscribedToCount:{
                $size:"$subscribedTo"
            },
            isSubscribed:{
                $cond:{
                    if:{$in: [req.user?._id,"$subscribers.subscriber"]},
                    then: true,
                    else:false
                }
            }
        }
    },
    {
        $project:{
            fullname:1,
            username:1,
            subscribersCount:1,
            channelsSubscribedToCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1


        }
    }
   ])
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    chnageCurrentPassword,
    getcurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,

}



//kise vi channel de subscriber count krne aa je
//apa document oh dekhna jide ch channel da naam aa reha 
//oh documents count krne aa jithe channel match kr reha
