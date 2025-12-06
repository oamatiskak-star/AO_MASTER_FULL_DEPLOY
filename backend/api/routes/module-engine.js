import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const PROCESSED = path.join(process.cwd(), "backend/modules_processed");
const INDEX_FILE = path.join(PROCESSED, "module_index.json");

// ensure folder exists
if (!fs.existsSync(PROCESSED)) fs.mkdirSync(PROCESSED, { recursive: true });

function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) return [];
  return JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
}

function saveIndex(list) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(list, null, 2));
}

// lijst modules
router.get("/", (req, res) => {
  res.json({ modules: loadIndex() });
});

// registreer module
router.post("/register", (req, res) => {
  const { filename } = req.body;

  if (!filename) return res.status(400).json({ error: "Geen bestandsnaam ontvangen" });

  const entry = {
    name: filename.replace(".zip", ""),
    filename,
    registered_at: new Date().toISOString()
  };

  const list = loadIndex();
  list.push(entry);
  saveIndex(list);

  res.json({ registered: true, module: entry });
});

export default router;
