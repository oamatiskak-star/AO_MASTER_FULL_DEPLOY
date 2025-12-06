import express from "express";
import path from "path";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "modules_incoming");
const storage = multer({ dest: uploadDir });
const upload = storage.single("file");

const router = express.Router();

router.post("/", upload, (req, res) => {
  return res.json({ uploaded: true, file: req.file.filename });
});

export default router;
