// routes/oauthRoutes.js
import express from "express";
import passport from "passport";
import generateToken from "../lib/utils.js";

const router = express.Router();

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // issue JWT using your util
        generateToken(req.user._id, res);
        res.redirect("https://chatify-psi-hazel.vercel.app/"); // frontend redirect
    }
);



export default router;
