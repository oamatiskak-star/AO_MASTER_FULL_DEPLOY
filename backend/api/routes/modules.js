import express from "express";
const router = express.Router();

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
