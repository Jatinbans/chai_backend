import { Apierror } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


const healthcheck = asyncHandler(async(req,res)=>{
    //build a healthcheck response that simply returns the OK status as json with a message

})

export{
    healthcheck
}