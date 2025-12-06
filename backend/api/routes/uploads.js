import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "backend/tmp_uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  res.json({ uploaded: true, filename: req.file.filename });
});

export default router;
