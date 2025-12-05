import express from "express";
import worker from "../../workers/calc/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "calc ok" });
});

router.post("/", async (req, res) => {
  const result = await worker(req.body);
  res.json({ status: "done", result });
});

export default router;
