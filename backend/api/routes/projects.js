import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ projects: [] });
});

export default router;
