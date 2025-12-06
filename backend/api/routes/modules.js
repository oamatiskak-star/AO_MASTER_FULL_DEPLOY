import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const uploadFolder = path.join(process.cwd(), "backend/tmp_uploads");

router.get("/", (req, res) => {
  const processed = fs.readdirSync(uploadFolder).filter(f => f.endsWith(".zip"));
  res.json({
    status: "ok",
    processed_modules: processed
  });
});

export default router;

