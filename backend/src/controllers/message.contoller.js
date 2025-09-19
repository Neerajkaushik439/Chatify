import cloudinary from "../lib/cloudniary.js";
import { getReciverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const allUser = async (req, res) => {
    try {
        const loggedUSer = req.user._id;
        const allusers = await User.find({_id: { $ne : loggedUSer}}).select("-password");
        res.status(200).json(allusers);
    } catch (error) {
        console.log("error in allUSer controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }    
}

export const allMessage = async (req, res) => {
    try {
        const loggedUSer = req.user._id;
        const secondUser = req.params.id;

        const chat = await Message.find({$or:[{senderId: loggedUSer, reciverId: secondUser}, {senderId: secondUser, reciverId: loggedUSer}]});

        res.status(200).json(chat);
    } catch (error) {
        console.log("error in getMessages controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMsg = async (req, res) => {
    const {text, img} = req.body;
    try {
        const reciverId = req.params.id;
        const senderId = req.user._id;
        
        let imgUrl;
        if(img){
            const uploadRes = await cloudinary.uploader.upload(img);
            imgUrl = uploadRes.secure_url;
        }

        const newMsg = new Message({
            senderId,
            reciverId,
            text,
            images: imgUrl
        })

        await newMsg.save();
        const reciverSocketId = getReciverSocketId(reciverId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage", newMsg)
        }


        res.status(201).json(newMsg);
        // have to built socket io


    } catch (error) {
        console.log("error in sendMsg controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}