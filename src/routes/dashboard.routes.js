import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { dashboardService } from "../services/dashboard.service.js";

const router = express.Router();

/**
 * GET /api/statuts
 */
router.get("/TotalCap", authMiddleware, async (req, res) => {
    try {
        const result = await dashboardService.getTotCap();
        res.json(result);
    } catch (error) {
        console.error("Error fetching total capcity:", error);
        res.status(500).json({ error: "Failed to fetch total capacity" });
    }
});

export default router