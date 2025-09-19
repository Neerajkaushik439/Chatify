import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {                // fixed typo
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    default: "",               // optional, can be empty if only media
  },
  media: [{   
    url: String,                  // array to support multiple files/videos
    type: String,
  }],
}, { timestamps: true });

const Message = mongoose.model("Message", msgSchema);
export default Message;
