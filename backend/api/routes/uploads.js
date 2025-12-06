import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();
const uploadPath = path.join(process.cwd(), "backend/tmp_uploads");
const upload = multer({ dest: uploadPath });

router.post("/", upload.single("file"), (req, res) => {
  return res.json({ uploaded: true, file: req.file.filename });
});

export default router;
