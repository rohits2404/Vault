import jwt from "jsonwebtoken";
import { randomUUID, createHash } from "crypto";

export function signAccessToken(user) {
    return jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    });
}

export function signRefreshToken(user) {
    const jti = randomUUID();
    const token = jwt.sign({ sub: user._id.toString(), jti }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    });
    return { token, jti };
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

export function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

export function refreshCookieOptions() {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}
