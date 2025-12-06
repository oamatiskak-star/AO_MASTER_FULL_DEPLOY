import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const TMP = path.join(process.cwd(), "backend/tmp_uploads");
const INDEX_FILE = path.join(TMP, "module_index.json");

// GET /api/module-engine
router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(INDEX_FILE)) {
      return res.json({ modules: [] });
    }

    const raw = fs.readFileSync(INDEX_FILE, "utf8");
    const list = JSON.parse(raw);

    return res.json({ modules: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
