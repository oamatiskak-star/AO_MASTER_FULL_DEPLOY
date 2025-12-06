import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const TMP = path.join(process.cwd(), "backend/tmp_uploads");
const INCOMING = path.join(process.cwd(), "backend/modules_incoming");

// Zorg dat directories bestaan
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
if (!fs.existsSync(INCOMING)) fs.mkdirSync(INCOMING, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TMP),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// POST /api/uploads
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Geen bestand ontvangen" });

    const source = path.join(TMP, req.file.filename);
    const target = path.join(INCOMING, req.file.filename);

    fs.renameSync(source, target);

    return res.json({
      uploaded: true,
      file: req.file.filename
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
