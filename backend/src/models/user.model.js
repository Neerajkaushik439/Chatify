import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlegth: 6,
    },
    phone: {
        type: String,
        required: true,   // make it mandatory (optional if you don’t want it required)
        unique: true,     // ensures no two users have the same phone number
    },
    provider: {
        type: String,
        enum: ["local", "google", "facebook", "linkedin"],
        default: "local",
    },
    pfp: {
        type: String,
        default: "",
    }
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;