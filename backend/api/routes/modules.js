import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const modulesDir = path.join(process.cwd(), "backend/modules_processed");

router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(modulesDir)) {
      return res.json({ modules: [] });
    }

    const items = fs.readdirSync(modulesDir)
      .filter(f => f.endsWith(".zip"))
      .map(f => ({ filename: f }));

    res.json({ modules: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
