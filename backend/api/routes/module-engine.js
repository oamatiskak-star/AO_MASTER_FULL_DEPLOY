import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const BASE = path.join(process.cwd(), "backend");
const TMP = path.join(BASE, "tmp_uploads");
const INCOMING = path.join(BASE, "modules_incoming");
const PROCESSED = path.join(BASE, "modules_processed");
const INDEX_FILE = path.join(PROCESSED, "module_index.json");

// Zorg dat directories bestaan
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
if (!fs.existsSync(INCOMING)) fs.mkdirSync(INCOMING, { recursive: true });
if (!fs.existsSync(PROCESSED)) fs.mkdirSync(PROCESSED, { recursive: true });

// GET → lijst modules
router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(INDEX_FILE)) {
      return res.json({ modules: [] });
    }
    const list = JSON.parse(fs.readFileSync(INDEX_FILE));
    return res.json({ modules: list });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
