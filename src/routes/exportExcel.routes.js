import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { exportExcel } from "../services/excel.service.js";

const router = express.Router();

router.get("/exportExcel", authMiddleware, async (req, res) => {
    try {
        await exportExcel(req, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;