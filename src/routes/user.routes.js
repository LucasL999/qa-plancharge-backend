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

/**
 * GET /api/users
 * GET all users with their role (libelle)
 */
router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

/**
 * POST /api/users
 * ADD user
 */
router.post("/users", authMiddleware, async (req, res) => {
    try {
        const { nom, prenom, id_role, absences, email } = req.body;
        const user = await userService.addUser(nom, prenom, id_role, absences, email);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Failed to add user" });
    }
});

/**
 * PUT /api/users/:id_user
 * EDIT user
 */
router.put("/users/:id_user", authMiddleware, async (req, res) => {
    try {
        const { id_user, nom, prenom, id_role, absences, email } = req.body;
        const user = await userService.updateUser(id_user, nom, prenom, id_role, absences, email);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});







export default router;