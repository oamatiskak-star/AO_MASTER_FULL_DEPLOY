import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    modules: [
      "calculation",
      "projects",
      "uploads",
      "ai_workers",
      "vercel_deploy",
      "github_sync",
      "architect_tools",
      "drawing_tools",
      "stabu_parser",
      "project_planning",
      "execution_engine",
      "procurement_sync",
      "invoices_sorting",
      "bookkeeping_bridge",
      "supabase_connector",
      "notifications",
      "ai_designer",
      "blueprint_reader",
      "pdf_to_bim",
      "dashboard_engine"
    ]
  });
});

export default router;
