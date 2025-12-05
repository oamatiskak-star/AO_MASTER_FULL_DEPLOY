import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  res.json({ uploaded: true });
});

export default router;
