import express from "express";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";

const router = express.Router();

const ROOT = process.cwd();
const TMP = path.join(ROOT, "backend/tmp_uploads");
const INCOMING = path.join(ROOT, "backend/modules_incoming");
const PROCESSED = path.join(ROOT, "backend/modules_processed");
const INDEX_FILE = path.join(PROCESSED, "module_index.json");

// Zorg dat alle mappen bestaan
for (const dir of [TMP, INCOMING, PROCESSED]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// GET: lijst modules
router.get("/", (req, res) => {
  if (!fs.existsSync(INDEX_FILE)) {
    return res.json({ modules: [] });
  }
  const list = JSON.parse(fs.readFileSync(INDEX_FILE));
  return res.json({ modules: list });
});

// POST: ontvang module ZIP via uploads endpoint → verwerk hem hier
router.post("/process", async (req, res) => {
  try {
    if (!req.body || !req.body.filename) {
      return res.status(400).json({ error: "filename ontbreekt" });
    }

    const uploadedZip = path.join(TMP, req.body.filename);

    if (!fs.existsSync(uploadedZip)) {
      return res.status(404).json({ error: "ZIP niet gevonden in tmp_uploads" });
    }

    const extractPath = path.join(INCOMING, req.body.filename.replace(".zip", ""));

    await fs
      .createReadStream(uploadedZip)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    const moduleInfo = {
      name: req.body.filename.replace(".zip", ""),
      path: extractPath,
      installed: new Date().toISOString(),
    };

    let index = [];
    if (fs.existsSync(INDEX_FILE)) {
      index = JSON.parse(fs.readFileSync(INDEX_FILE));
    }

    index.push(moduleInfo);

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));

    return res.json({ success: true, module: moduleInfo });
  } catch (err) {
    console.error("MODULE ENGINE ERROR", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
