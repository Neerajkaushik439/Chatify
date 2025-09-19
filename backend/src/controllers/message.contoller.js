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
    const loggedUser = req.user._id;
    const secondUser = req.params.id;

    const chat = await Message.find({
      $or: [
        { senderId: loggedUser, reciverId: secondUser },
        { senderId: secondUser, reciverId: loggedUser },
      ],
    }).sort({ createdAt: 1 }); // sort by time ascending

    res.status(200).json(chat);
  } catch (error) {
    console.log("error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMsg = async (req, res) => {
  const { text, mediaFiles } = req.body; // array of base64 strings or URLs
  try {
    const reciverId = req.params.id;
    const senderId = req.user._id;

    let uploadedMedia = [];

    if (mediaFiles?.length > 0) {
      for (const file of mediaFiles) {
        const uploadRes = await cloudinary.uploader.upload(file, {
          folder: "chat_media",
          resource_type: "auto", // auto detects image/video/document
        });
        uploadedMedia.push({ url: uploadRes.secure_url, type: uploadRes.resource_type });
      }
    }

    const newMsg = new Message({
      senderId,
      reciverId,
      text,
      media: uploadedMedia,
    });

    await newMsg.save();

    // Emit to receiver if online
    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMsg);
    }

    // Emit back to sender
    io.to(req.socketId).emit("messageSent", newMsg);

    res.status(201).json(newMsg);
  } catch (error) {
    console.log("error in sendMsg controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
