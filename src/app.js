import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import chantierRoutes from "./routes/chantier.routes.js";
import teamRoutes from "./routes/team.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import exportExcelRoutes from "./routes/exportExcel.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use("/api", userRoutes);
app.use("/api", chantierRoutes);
app.use("/api", teamRoutes);
app.use("/api", dashboardRoutes)
app.use("/api", calendarRoutes);
app.use("/api", exportExcelRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;