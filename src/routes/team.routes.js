import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { teamService } from "../services/team.service.js";

const router = express.Router();

/**
 * GET /api/QA
 */
router.get("/qa", authMiddleware, async (req, res) => {
    try {
        const qas = await teamService.getAllTeam();
        res.json(qas);
    } catch (error) {
        console.error("Error fetching QAs:", error);
        res.status(500).json({ error: "Failed to fetch QAs" });
    }
});



export default router;