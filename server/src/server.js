import "dotenv/config"
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { protect } from "./middleware/authMiddleware.js";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, 
}));

app.use(json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);

// A tiny "dummy" protected resource for the dashboard to call, beyond /me.
app.get("/api/dashboard/summary", protect, (req, res) => {
    res.json({
        message: "This is a protected payload. Only a valid access token can fetch it.",
        generatedAt: new Date().toISOString(),
        stats: [
            { label: "Active session", value: "Verified" },
            { label: "Token type", value: "Access (short-lived)" },
            { label: "Server time", value: new Date().toLocaleTimeString() },
        ],
    });
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
