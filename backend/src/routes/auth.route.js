import express from "express"
import { getUSer, login, logout, signup, updatePfp } from "../controllers/auth.controller.js";
import {fetchUser} from "../middlewares/fetchUser.js";
import { updateUser ,deleteUser,getAllUsers} from "../controllers/auth.controller.js";


const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.put("/update-pfp", fetchUser, updatePfp);
authRoute.get("/get-user", fetchUser, getUSer);



authRoute.delete("/user/:id", fetchUser, (req, res, next) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Forbidden: You can only delete your own account" });
  }
  next();
}, deleteUser);

// Optional: get all users (can remove if not needed)
authRoute.get("/users", fetchUser, getAllUsers);

export default authRoute;