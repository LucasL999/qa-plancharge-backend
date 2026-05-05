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

/**
 * POST /api/chantier
 * ADD chantier
 */
router.post("/chantier", authMiddleware, async (req, res) => {
    try {
        const { chantier, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin } = req.body;
        const result = await chantierService.addChantier(chantier, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur"});
    }
});

/**
 * GET /api/getChantier
 */
router.get("/getChantier", authMiddleware, async (req, res) => {
    try {
        const result = await chantierService.getChantier();
        res.json(result);
    } catch (error) {
        console.error("Error fetching chantier Chantier:", error);
        res.status(500).json({ error: "Failed to fetch Chantier" });
    }
});

/**
 * PUT /api/updateChantier
 * EDIT chantier
 * a finir lorsque l'import de l'excel seroa OK :service
 */
router.put("/updateChantier", authMiddleware, async (req, res) => {
    try {
        const { chantier, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin } = req.body;
        const result = await chantierService.updateChantier(chantier, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error updating chantier:", error);
        res.status(500).json({ error: "Failed to update chantier" });
    }
});



export default router;