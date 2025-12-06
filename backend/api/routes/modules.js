import express from "express";
import multer from "multer";

const router = express.Router();

// tijdelijke upload map
const upload = multer({ dest: "tmp_uploads/" });

// POST voor ZIP upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Geen bestand ontvangen" });
  }

  res.json({
    status: "upload ok",
    originalName: req.file.originalname,
    storedAs: req.file.filename
  });
});

// GET test route (optioneel)
router.get("/", (req, res) => {
  res.json({
    status: "modules ok",
    modules: [
      "calculaties",
      "projecten",
      "uploads",
      "ai_workers",
      "vercel_deploy",
      "github_push"
    ]
  });
});

export default router;
