import ChantiersRoutes from "./chantier.routes.js";
import CalendarRoutes from "./calendar.routes.js";

export default (app) => {
  app.use("/chantiers", ChantiersRoutes);
  app.use("/calendar", CalendarRoutes);
};
