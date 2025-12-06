import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const INCOMING_DIR = path.join(process.cwd(), "backend/modules_incoming");
if (!fs.existsSync(INCOMING_DIR)) fs.mkdirSync(INCOMING_DIR, { recursive: true });

// POST /api/uploads
router.post("/", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "Geen bestand ontvangen" });
    }

    const file = req.files.file;
    const dest = path.join(INCOMING_DIR, file.name);

    await file.mv(dest);

    return res.json({
      uploaded: true,
      filename: file.name,
      size: file.size
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
