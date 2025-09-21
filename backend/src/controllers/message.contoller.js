import cloudinary, { uploadMedia } from "../lib/cloudniary.js";
import { getReciverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const allUser = async (req, res) => {
  try {
    const loggedUSer = req.user._id;
    const allusers = await User.find({ _id: { $ne: loggedUSer } }).select("-password");
    res.status(200).json(allusers);
  } catch (error) {
    console.log("error in allUSer controller", error.message);
    res.status(500).json({ message: "Internal server error" });
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
    console.log(req.params.id, " iddddd");
    console.log("req.body keys:", Object.keys(req.body || {}));
    console.log("typeof mediaFiles:", typeof mediaFiles);
    if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
      console.log("first media item keys:", Object.keys(mediaFiles[0] || {}));
      if (typeof mediaFiles[0] === "string") {
        console.log("first media string length:", mediaFiles[0].length);
      } else if (mediaFiles[0].data) {
        console.log("first media data length:", String(mediaFiles[0].data).length);
      }
    }
    const reciverId = req.params.id;
    const senderId = req.user._id;

    let uploadedMedia = [];
    console.log("sendMsg called. mediaFiles length:", mediaFiles ? mediaFiles.length : 0);
    if (mediaFiles?.length > 0) {
      for (const file of mediaFiles) {
        try {
          // file is expected to be { data: dataUrl, type, name }
          const input = file.data || file; // support both direct data string or object
          const uploadRes = await uploadMedia(input, {
            folder: "chat_media",
            resource_type: "auto",
            public_id: file?.name?.split(".")[0], // optional: use filename
          });
          const url = uploadRes.secure_url || uploadRes.url || null;
          const type = uploadRes.resource_type || file.type || (url && url.startsWith("data:video") ? "video" : "image");
          uploadedMedia.push({ url, type, name: file?.name });
          console.log("uploaded file:", { name: file?.name, url, type });
        } catch (uploadErr) {
          console.error("upload error for file", uploadErr && (uploadErr.message || uploadErr));
        }
      }
      console.log("all uploadedMedia:", uploadedMedia);
    }

    // Ensure uploadedMedia is an array of { url, type }
    let mediaToSave = [];
    if (Array.isArray(uploadedMedia)) {
      mediaToSave = uploadedMedia.filter((m) => m && m.url).map((m) => ({ url: m.url, type: m.type }));
    } else if (typeof uploadedMedia === "string") {
      try {
        const parsed = JSON.parse(uploadedMedia);
        if (Array.isArray(parsed)) mediaToSave = parsed.filter((m) => m && m.url).map((m) => ({ url: m.url, type: m.type }));
      } catch (e) {
        // ignore parsing error and leave mediaToSave empty
      }
    }

    console.log("mediaToSave (will be persisted):", mediaToSave);

    const newMsg = new Message({
      senderId,
      reciverId,
      text,
      media: mediaToSave.map((m) => m.url), // store only URLs in DB
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
