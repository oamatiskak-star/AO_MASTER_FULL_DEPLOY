import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

// ROUTES
import pingRoute from "./routes/ping.js";
import uploadsRoute from "./routes/uploads.js";
import moduleEngineRoute from "./routes/module-engine.js";

// UTILS
import { errorHandler } from "./utils/errorHandler.js";

// INIT APP
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// ROUTES
app.use("/api/ping", pingRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/module-engine", moduleEngineRoute);

// 404 fallback
app.use((req, res) => res.status(404).json({ error: "Route niet gevonden" }));

// ERROR HANDLER
app.use(errorHandler);

// START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("AO Backend draait op poort", PORT));
