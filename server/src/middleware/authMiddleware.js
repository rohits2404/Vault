import { verifyAccessToken } from "../utils/generateToken.js";

export function protect(req, res, next) {
  
    const header = req.headers.authorization || "";
  
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Missing access token" });
    }

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, email: payload.email };
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired", code: "ACCESS_TOKEN_EXPIRED" });
        }
        return res.status(401).json({ message: "Invalid access token" });
    }
}
