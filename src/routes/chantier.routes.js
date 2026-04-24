import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { chantierService } from "../services/chantier.service.js";

const router = express.Router();

/**
 * GET /api/statuts
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
/**
 * GET /api/priorites
 */
router.get("/priorites", authMiddleware, async (req, res) => {
    try {
        const priorities = await chantierService.getChantierPriority();
        res.json(priorities);
    } catch (error) {
        console.error("Error fetching chantier priorities:", error);
        res.status(500).json({ error: "Failed to fetch chantier priorities" });
    }
});

/**
 * GET /api/newChantierQA
 */
router.get("/newChantierQA", authMiddleware, async (req, res) => {
    try {
        const result = await chantierService.getQA();
        res.json(result);
    } catch (error) {
        console.error("Error fetching chantier QA:", error);
        res.status(500).json({ error: "Failed to fetch chantier QA" });
    }
});



export default router;