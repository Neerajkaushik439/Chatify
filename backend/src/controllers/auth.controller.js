import cloudinary from "../lib/cloudniary.js";
import generateToken from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
  const { fullname, email, mobile, password } = req.body;

  try {
    if (!fullname || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    // check if email or mobile exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email or mobile already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      mobile,
      password: hashpass,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      mobile: newUser.mobile,
    });
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const login = async (req, res) => {
  const { email, mobile, password } = req.body;

  try {
    if ((!email && !mobile) || !password) {
      return res.status(400).json({ message: "Email or mobile and password are required" });
    }

    // find user by email or mobile
    const user = await User.findOne({
      $or: [{ email }, { mobile }]
    }).select("email mobile password fullname");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
      token,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(201).json({message: "logout successfully"});
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const updatePfp = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const {pfp} = req.body;
    const userId = req.user._id;
    console.log(userId, "userId")

    if(!pfp) return res.status(400).json({message: " Profile pic required "});
    try {
        const uploadRes = await cloudinary.uploader.upload(pfp, {
            folder: "profile_pictures",  
            transformation: [{ width: 500, height: 500, crop: "limit" }] 
        });

        const updatedUser = await User.findByIdAndUpdate(
            {_id:userId},
            { pfp: uploadRes.secure_url },
            { new: true }
        );
        console.log(updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ message: "Failed to upload image. Try again." });
    }

}

// Update user
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { fullname, email, mobile, password } = req.body;

  try {
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUSer = async (req, res) => {
    try {
        const user = req.user
        // console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.log("error in get-user controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
