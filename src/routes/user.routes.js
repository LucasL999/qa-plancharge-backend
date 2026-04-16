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

/**
 * GET /api/roles
 */
router.get("/roles", authMiddleware, async (req, res) => {
    try {
        const roles = await userService.getRoles();
        res.json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ error: "Failed to fetch roles" });
    }
});


export default router;