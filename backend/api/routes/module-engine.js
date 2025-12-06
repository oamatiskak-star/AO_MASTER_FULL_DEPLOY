import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const TMP = path.join(process.cwd(), "backend/tmp_uploads");
const INDEX_FILE = path.join(TMP, "module_index.json");

router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(INDEX_FILE)) {
      return res.json({ modules: [] });
    }

    const modules = JSON.parse(fs.readFileSync(INDEX_FILE));
    return res.json({ modules });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
