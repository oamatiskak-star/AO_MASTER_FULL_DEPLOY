import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Map voor binnenkomende ZIP modules
const INCOMING_DIR = path.join(process.cwd(), "backend/modules_incoming");

// Map waar verwerkte modules komen
const PROCESSED_DIR = path.join(process.cwd(), "backend/modules_processed");

// Zorg dat mappen bestaan
if (!fs.existsSync(INCOMING_DIR)) fs.mkdirSync(INCOMING_DIR, { recursive: true });
if (!fs.existsSync(PROCESSED_DIR)) fs.mkdirSync(PROCESSED_DIR, { recursive: true });

// Bestandsindex
const INDEX_FILE = path.join(PROCESSED_DIR, "module_index.json");

// Helper: laad index
function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
  } catch {
    return [];
  }
}

// Helper: schrijf index
function saveIndex(list) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(list, null, 2));
}

// ------------------------------------------
// GET /api/module-engine
// ------------------------------------------
router.get("/", (req, res) => {
  const modules = loadIndex();
  return res.json({ modules });
});

// ------------------------------------------
// POST /api/module-engine/upload
// ------------------------------------------
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "Geen bestand ontvangen" });
    }

    const file = req.files.file;
    const destPath = path.join(INCOMING_DIR, file.name);

    await file.mv(destPath);

    const index = loadIndex();
    index.push({
      name: file.name,
      size: file.size,
      uploaded_at: new Date().toISOString()
    });

    saveIndex(index);

    return res.json({
      uploaded: true,
      file: file.name,
      size: file.size
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// Export
// ------------------------------------------
export default router;
