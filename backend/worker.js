import fs from "fs";
import path from "path";

const INCOMING = path.join(process.cwd(), "backend/modules_incoming");
const PROCESSED = path.join(process.cwd(), "backend/modules_processed");
const INDEX_FILE = path.join(PROCESSED, "module_index.json");

if (!fs.existsSync(INCOMING)) fs.mkdirSync(INCOMING, { recursive: true });
if (!fs.existsSync(PROCESSED)) fs.mkdirSync(PROCESSED, { recursive: true });

// helper
function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) return [];
  return JSON.parse(fs.readFileSync(INDEX_FILE));
}

function saveIndex(list) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(list, null, 2));
}

// watcher
fs.watch(INCOMING, (eventType, filename) => {
  if (!filename || !filename.endsWith(".zip")) return;

  const src = path.join(INCOMING, filename);
  const dest = path.join(PROCESSED, filename);

  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);

    const index = loadIndex();
    index.push({
      name: filename.replace(".zip", ""),
      filename,
      processed_at: new Date().toISOString()
    });

    saveIndex(index);

    console.log("Module automatisch verwerkt:", filename);
  }
});

console.log("Worker actief…");
