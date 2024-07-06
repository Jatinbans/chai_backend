import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"})) //forms , data json
app.use(express.urlencoded({extended: true,limit:"16kb"})) // space nu %20
app.use(express.static("public")) // assets,images 
app.use(cookieParser()) //cookies nu server hi read kr skda


//routes import 
import userRouter from "./routes/user.routes.js";


//routes declartion
app.use("/api/v1/users",userRouter)
export{ app }