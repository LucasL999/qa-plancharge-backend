import { Router } from "express";
import ChantiersRoutes from "./chantier.routes.js";
import CalendarRoutes from "./calendar.routes.js";

const router = Router();

router.use(ChantiersRoutes);
router.use(CalendarRoutes);

export default router;
