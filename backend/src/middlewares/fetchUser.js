import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const  fetchUser = async (req, res, next) => {
    try {
        let token;

        // 1. Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
        }

        // 2. Fallback: check cookie (optional)
        if (!token && req.cookies.token) {
            token = req.cookies.token;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) return res.status(401).json({message:"False token provided"});

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"No user found"});
        }

        req.user = user;
        console.log(user)

        next();

    } catch (error) {
        console.log("error in fetchuser", error);
        return res.status(500).json({message: "INternal server error"});
    }
}