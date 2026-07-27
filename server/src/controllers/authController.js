import User from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken, refreshCookieOptions } from "../utils/generateToken.js";

const MAX_SESSIONS_PER_USER = 5; // cap concurrent refresh sessions (simple device limit)

async function issueTokenPair(user, req, res) {
  
    const accessToken = signAccessToken(user);
    const { token: refreshToken, jti } = signRefreshToken(user);

    user.refreshSessions.push({
        tokenHash: hashToken(jti),
        userAgent: req.headers["user-agent"] || "unknown",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Prune oldest sessions past the cap and any that have expired.
    user.refreshSessions = user.refreshSessions
    .filter((s) => s.expiresAt > new Date())
    .slice(-MAX_SESSIONS_PER_USER);

    await user.save();
    res.cookie("refreshToken", refreshToken, refreshCookieOptions());
    return accessToken;
}

// POST /api/auth/signup
export async function signUp(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are all required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "An account with that email already exists" });
        }

        const user = await User.create({ name, email, password });
        const accessToken = await issueTokenPair(user, req, res);

        return res.status(201).json({ user: user.toSafeJSON(), accessToken });
    } catch (err) {
        console.error("signup error:", err.message);
        return res.status(500).json({ message: "Something went wrong creating your account" });
    }
}

// POST /api/auth/login
export async function signIn(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = await issueTokenPair(user, req, res);
        return res.status(200).json({ user: user.toSafeJSON(), accessToken });
    } catch (err) {
        console.error("login error:", err.message);
        return res.status(500).json({ message: "Something went wrong logging you in" });
    }
}

// POST /api/auth/refresh
export async function refreshToken(req, res) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
        return res.status(401).json({ message: "Missing refresh token" });
        }

        let payload;
        try {
        payload = verifyRefreshToken(token);
        } catch (err) {
        res.clearCookie("refreshToken", refreshCookieOptions());
        return res.status(401).json({ message: "Refresh token invalid or expired" });
        }

        const user = await User.findById(payload.sub);
        if (!user) {
        res.clearCookie("refreshToken", refreshCookieOptions());
        return res.status(401).json({ message: "User no longer exists" });
        }

        const incomingHash = hashToken(payload.jti);
        const matchIndex = user.refreshSessions.findIndex((s) => s.tokenHash === incomingHash);

        if (matchIndex === -1) {
            // Reuse of an already-rotated/unknown token - nuke all sessions.
            user.refreshSessions = [];
            await user.save();
            res.clearCookie("refreshToken", refreshCookieOptions());
            return res.status(401).json({ message: "Session invalid - please log in again" });
        }

        // Remove the used session before issuing the replacement (rotation).
        user.refreshSessions.splice(matchIndex, 1);
        await user.save();

        const accessToken = await issueTokenPair(user, req, res);
        return res.status(200).json({ user: user.toSafeJSON(), accessToken });
    } catch (err) {
        console.error("refresh error:", err.message);
        return res.status(500).json({ message: "Something went wrong refreshing your session" });
    }
}

// POST /api/auth/logout
export async function logout(req, res) {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            try {
                const payload = verifyRefreshToken(token);
                const incomingHash = hashToken(payload.jti);
                await User.findByIdAndUpdate(payload.sub, {
                    $pull: { refreshSessions: { tokenHash: incomingHash } },
                });
            } catch (_) {}
        }
        res.clearCookie("refreshToken", refreshCookieOptions());
        return res.status(200).json({ message: "Logged out" });
    } catch (err) {
        console.error("logout error:", err.message);
        return res.status(500).json({ message: "Something went wrong logging out" });
    }
}

// GET /api/auth/me  (protected - used by the dashboard)
export async function me(req, res) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: user.toSafeJSON() });
}
