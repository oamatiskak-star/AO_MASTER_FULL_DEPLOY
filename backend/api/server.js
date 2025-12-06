import express from "express";
import cors from "cors";
import "../api/services/moduleEngine.js";

// Routes
import pingRoute from "./routes/ping.js";
import calcRoute from "./routes/calc.js";
import projectsRoute from "./routes/projects.js";
import uploadsRoute from "./routes/uploads.js";
import modulesRoute from "./routes/modules.js";
import moduleEngineRoute from "./routes/module-engine.js";

// Utils
import { errorHandler } from "../utils/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/ping", pingRoute);
app.use("/api/calc", calcRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/modules", modulesRoute);
app.use("/api/module-engine", moduleEngineRoute);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route niet gevonden" });
});

// Error handler
app.use(errorHandler);

const PORT = 4000;
import "./services/moduleEngine.js";
app.listen(PORT, () => {
  console.log("Backend draait op http://localhost:" + PORT);
});
