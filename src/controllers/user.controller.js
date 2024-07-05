import { asyncHandler } from "../utils/asynchandler.js";
const registerUser = asyncHandler(async (req,res) =>{
     req.status(200).json({
        message: "ok"
    })
})

export {registerUser}