import express from "express"
import { logout, me, refreshToken, signIn, signUp } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.post("/refresh", refreshToken)
router.post("/logout", logout)

router.post("/me", protect, me)

export default router
