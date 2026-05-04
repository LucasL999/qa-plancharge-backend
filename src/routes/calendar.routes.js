import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { calendarService } from "../services/calendar.service.js";

const router = express.Router();

/**
 * POST /api/addEvent
 * ADD event
 */
router.post("/addEvent", authMiddleware, async (req, res) => {
    try {
        const email = req.user.email;
        const { date_debut, date_fin } = req.body;
        const event = await calendarService.addEvent(email, date_debut, date_fin);
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur"});
    }
});

/**
 * GET /api/getEvent
 * GET event
 */

router.get("/events", authMiddleware, async (req, res) => {
    try {
        const email = req.user.email;
        const event = await calendarService.getEvent(email);
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur"});
    }
});

/**
 * DELETE /api/deleteEvent
 * DELETE event
 */
router.delete("/deleteEvent", authMiddleware, async (req, res) => {
    try {
        const email = req.user.email;
        const { date_debut, date_fin } = req.body;
        const deleteEvent = await calendarService.deleteEvent(email, date_debut, date_fin);
        res.status(201).json({ success: true, data: deleteEvent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur"});
    }
});

export default router;