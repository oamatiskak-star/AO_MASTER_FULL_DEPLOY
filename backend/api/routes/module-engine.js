import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Render container folder (bestaat gegarandeerd)
const MODULE_DIR = path.join(process.cwd(), "backend/tmp_uploads");

// Zorg dat map bestaat
if (!fs.existsSync(MODULE_DIR)) {
  fs.mkdirSync(MODULE_DIR, { recursive: true });
}

// GET /api/module-engine
router.get("/", (req, res) => {
  try {
    const files = fs.readdirSync(MODULE_DIR).filter(f => f.endsWith(".zip"));
    return res.json({ modules: files });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
