import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const TMP = path.join(process.cwd(), "backend/tmp_uploads");

if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

router.get("/", (req, res) => {
  try {
    const list = fs.readdirSync(TMP).filter(f => f.endsWith(".zip"));
    return res.json({ modules: list });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
