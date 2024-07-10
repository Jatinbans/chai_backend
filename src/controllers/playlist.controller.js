import mongoose, {isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { Apierror } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //create playlist
})
const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //get user playlists
})
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //get playlist by id
})
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //create playlist
})
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //remove video from  playlist
})
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //delete playlist
})
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //update playlist
})




export{
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
}