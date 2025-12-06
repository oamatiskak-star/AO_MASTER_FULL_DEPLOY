import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const INCOMING = path.join(process.cwd(), "backend/modules_incoming");

// maak map als hij niet bestaat
if (!fs.existsSync(INCOMING)) fs.mkdirSync(INCOMING, { recursive: true });

// upload één bestand
router.post("/", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "Geen bestand ontvangen" });
    }

    const file = req.files.file;
    const dest = path.join(INCOMING, file.name);
    await file.mv(dest);

    return res.json({ uploaded: true, filename: file.name, size: file.size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// bulk upload
router.post("/bulk", async (req, res) => {
  try {
    if (!req.files) return res.status(400).json({ error: "Geen bestanden ontvangen" });

    const items = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const uploaded = [];

    for (const file of items) {
      const dest = path.join(INCOMING, file.name);
      await file.mv(dest);
      uploaded.push(file.name);
    }

    return res.json({ uploaded: true, files: uploaded });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
