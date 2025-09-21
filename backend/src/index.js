import express from "express";
import dotenv from "dotenv";
import { connectiondb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import passport from "./config/passport.js";
import session from "express-session";

dotenv.config();

// Use PORT from env or default to 3000 for local development
const PORT = process.env.PORT || 3000;

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";

// --- Middlewares ---
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:19006", // Expo Go
    "exp://127.0.0.1:19000",  // Expo Dev Client
    "http://localhost:3000",
    "https://chatify-psi-hazel.vercel.app",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- Session & Passport ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use("/api/auth", authRoute);         // normal signup/login
app.use("/api/auth/oauth", oauthRoutes); // google/facebook/linkedin
app.use("/api/messages", messageRoute);

// --- Start Server ---
server.listen(PORT, () => {
  console.log("server is running on " + PORT);
  connectiondb();
});
