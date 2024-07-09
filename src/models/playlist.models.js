import mongoose, { Schema } from "mongoose";
const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        requied:true,
    },

    description:{
        type:String,
        requied:true,
    },

    video:[
        {
        type:Schema.Types.ObjectId,
        ref:"User"
        }
       
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"

    },

},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)
