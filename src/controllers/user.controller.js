import { asyncHandler } from "../utils/asynchandler.js";
import {Apierror} from "../utils/Apierror.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";
import { response } from "express";


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

export {
    registerUser,
    loginUser,
    logoutUser
}