import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userService } from "../services/user.service.js";

const router = express.Router();

/**
 * GET /api/me
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;

    const user = await userService.findByEmail(email);

    if (!user) {
      return res.status(403).json({
        error: "User not found in database"
      });
    }

    return res.json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error("❌ /me error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;