import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

const WATCH_DIR = path.resolve("tmp_uploads");

console.log("AO MODULE ENGINE gestart");
console.log("Watching folder:", WATCH_DIR);

if (!fs.existsSync(WATCH_DIR)) {
  fs.mkdirSync(WATCH_DIR, { recursive: true });
}

fs.watch(WATCH_DIR, async (event, filename) => {
  if (!filename) return;
  if (!filename.endsWith(".zip")) return;

  const zipPath = path.join(WATCH_DIR, filename);
  const extractDir = path.join(WATCH_DIR, filename.replace(".zip", ""));

  console.log("ZIP gedetecteerd:", zipPath);

  try {
    const zip = new AdmZip(zipPath);

    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir);
    }

    zip.extractAllTo(extractDir, true);

    console.log("ZIP uitgepakt naar:", extractDir);
  } catch (err) {
    console.error("ZIP extract error:", err);
  }
});
