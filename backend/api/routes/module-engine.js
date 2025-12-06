import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const PROCESSED = path.join(process.cwd(), "backend/modules_processed");
const INDEX_FILE = path.join(PROCESSED, "module_index.json");

// Zorg dat map bestaat
if (!fs.existsSync(PROCESSED)) fs.mkdirSync(PROCESSED, { recursive: true });

// Helper: index laden
function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) return [];
  return JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
}

// Helper: index opslaan
function saveIndex(list) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(list, null, 2));
}

// GET /api/module-engine
router.get("/", (req, res) => {
  return res.json({ modules: loadIndex() });
});

// POST /api/module-engine/register
router.post("/register", (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ error: "filename ontbreekt" });
  }

  const entry = {
    name: filename.replace(".zip", ""),
    filename,
    registered_at: new Date().toISOString()
  };

  const list = loadIndex();
  list.push(entry);
  saveIndex(list);

  return res.json({ registered: true, module: entry });
});

export default router;
