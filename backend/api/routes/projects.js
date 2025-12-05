import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ projects: [] });
});

export default router;
