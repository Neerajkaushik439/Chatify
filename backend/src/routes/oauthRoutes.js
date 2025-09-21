// routes/oauthRoutes.js
import express from "express";
import passport from "passport";
import generateToken from "../lib/utils.js";

const router = express.Router();

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }), (req, res)=>{
    console.log("/google called");
});

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        console.log("here inside oauth");
        // issue JWT using your util
        const token = generateToken(req.user._id, res);     
        res.redirect(`https://chatify-psi-hazel.vercel.app/auth/callback?token=${token}`); // frontend redirect
    }
);



export default router;
