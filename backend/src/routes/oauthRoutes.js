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
        res.redirect("http://localhost:5173/dashboard"); // frontend redirect
    }
);

// Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get("/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        generateToken(req.user._id, res);
        res.redirect("http://localhost:5173/dashboard");
    }
);

// LinkedIn
router.get("/linkedin", passport.authenticate("linkedin"));

router.get("/linkedin/callback",
    passport.authenticate("linkedin", { failureRedirect: "/login" }),
    (req, res) => {
        generateToken(req.user._id, res);
        res.redirect("http://localhost:5173/dashboard");
    }
);

export default router;
