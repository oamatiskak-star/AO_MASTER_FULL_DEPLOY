import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ engine: "running", modules: [] });
});

export default router;
