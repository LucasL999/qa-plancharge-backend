import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { chantierService } from "../services/chantier.service.js";

const router = express.Router();

/**
 * GET /api/chantier/statuts
 */
router.get("/statuts", authMiddleware, async (req, res) => {
    try {
        const status = await chantierService.getChantierStatus();
        res.json(status);
    } catch (error) {
        console.error("Error fetching chantier status:", error);
        res.status(500).json({ error: "Failed to fetch chantier status" });
    }
});

export default router;