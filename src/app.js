import express from "express";
import cors from "cors";

import registerRoutes from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

registerRoutes(app);

export default app;