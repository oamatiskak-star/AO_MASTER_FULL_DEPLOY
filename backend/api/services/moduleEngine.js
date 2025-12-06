import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import uploadToSupabase from "./supabaseUploader.js";
import pushToGithub from "./githubPush.js";
import triggerVercel from "./vercelTrigger.js";

const WATCH_DIR = path.resolve("tmp_uploads");

console.log("AO MODULE ENGINE gestart (Super-Modus D)");
console.log("Watching folder:", WATCH_DIR);

if (!fs.existsSync(WATCH_DIR)) {
  fs.mkdirSync(WATCH_DIR, { recursive: true });
}

fs.watch(WATCH_DIR, async (eventType, filename) => {
  if (!filename || !filename.endsWith(".zip")) return;

  const filePath = path.join(WATCH_DIR, filename);
  const extractDir = filePath.replace(".zip", "");

  console.log("\n--- Nieuwe module gedetecteerd:", filename);

  try {
    const zip = new AdmZip(filePath);
    zip.extractAllTo(extractDir, true);
    console.log("Uitgepakt naar:", extractDir);

    // 1. Upload naar Supabase
    await uploadToSupabase(filePath, filename);

    // 2. Push naar GitHub
    await pushToGithub(extractDir, filename);

    // 3. Trigger Vercel
    await triggerVercel(filename);

    console.log("Module-flow succesvol afgerond voor:", filename);
  } catch (err) {
    console.error("Fout in moduleEngine flow:", err);
  }
});
