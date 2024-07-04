// require ('dotenv').config()

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import e from "express";
dotenv.config({
    path: './env'
})

await connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Mongodb connection failed !!",error);
})














/*
import express from "express"
const app = express();

(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("Error:", error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.log("Error: ",error);
        throw error
    }
})()*/