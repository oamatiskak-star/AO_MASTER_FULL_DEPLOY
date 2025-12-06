import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ calc: "working" });
});

export default router;
