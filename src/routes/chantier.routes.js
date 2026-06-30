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
        console.error("Error fetching Chantier:", error);
        res.status(500).json({ error: "Failed to fetch Chantier" });
    }
});

/**
 * PUT /api/updateChantier
 * EDIT chantier
 * a finir lorsque l'import de l'excel sera OK :service
 */
router.put("/updateChantier", authMiddleware, async (req, res) => {
    try {
        const { id, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin } = req.body;
        const result = await chantierService.updateChantier( id, priorite, statut, qa, cp, financement, nature, capacite, prev, cons, debut, fin);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error updating chantier:", error);
        res.status(500).json({ error: "Failed to update chantier" });
    }
});

/**
 * GET /api/prev
 */
router.get("/prev", authMiddleware, async (req, res) => {
    try {
        const result = await chantierService.getPrev();
        res.json(result);
    } catch (error) {
        console.error("Error fetching Prévisionnel:", error);
        res.status(500).json({ error: "Failed to fetch Prévisionnel" });
    }
});

/**
 * GET /api/cons
 */
router.get("/cons", authMiddleware, async (req, res) => {
    try {
        const result = await chantierService.getCons();
        res.json(result);
    } catch (error) {
        console.error("Error fetching Consommé:", error);
        res.status(500).json({ error: "Failed to fetch Consommé" });
    }
});

/**
 * GET /api/alertes
 */
router.get("/alertes", authMiddleware, async (req, res) => {
    try {
        const result = await chantierService.getAlertes();
        res.json(result);
    } catch (error) {
        console.error("Error fetching Alertes:", error);
        res.status(500).json({ error: "Failed to fetch Alertes" });
    }
});

/**
 * GET /api/historique
 */
router.get("/historique", authMiddleware, async (req, res) => {
    try {
        const result = await chantierService.getHistorique();
        res.json(result);
    } catch (error) {
        console.error("Error fetching Historique:", error);
        res.status(500).json({ error: "Failed to fetch Historique" });
    }
});

/**
 * GET /api/Nbalertes
 */
router.get("/Nbalertes", authMiddleware, async (req, res) => {
    try {
        const result = await chantierService.getNbAlertes();
        res.json(result);
    } catch (error) {
        console.error("Error fetching Nb Alertes:", error);
        res.status(500).json({ error: "Failed to fetch Nb Alertes" });
    }
});



export default router;