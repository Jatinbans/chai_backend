import { asyncHandler } from "../utils/asynchandler.js";
import {Apierror} from "../utils/Apierror.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";
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
    console.log("email:",email);

    if(
        [fullname,email,username,password].some((field)=> 
        field?.trim() === "")
    ) {
        throw new Apierror(400,"all fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new Apierror(409,"user with email or username already exists")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath =req.files?.coverImage[0]?.path;

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

export {registerUser}