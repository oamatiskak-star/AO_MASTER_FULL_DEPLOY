import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Geen bestand ontvangen" });
    }

    // Simpel antwoord zodat upload werkt
    res.json({
      status: "ok",
      bestand: req.file.originalname,
      locatie: req.file.path
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
