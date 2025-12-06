import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { supabase } from "../supabase/config.js";

const TMP = path.join(process.cwd(), "backend/tmp_uploads");
const PROCESSED = path.join(TMP, "processed");
const INDEX_FILE = path.join(TMP, "module_index.json");

// zorg dat folders bestaan
for (const dir of [TMP, PROCESSED]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

// index initialiseren
if (!fs.existsSync(INDEX_FILE)) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify([], null, 2));
}

// module registreren in JSON index
function saveToIndex(moduleMeta) {
  const index = JSON.parse(fs.readFileSync(INDEX_FILE));
  index.push(moduleMeta);
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

async function processZip(zipPath) {
  const zipName = path.basename(zipPath);
  const moduleName = zipName.replace(".zip", "");
  const extractPath = path.join(TMP, moduleName);

  console.log("=== MODULE ENGINE: Verwerken:", zipName);

  // 1. unzip
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise();

  // 2. upload bestanden naar Supabase
  const files = fs.readdirSync(extractPath);

  const uploaded = [];
  for (const file of files) {
    const fullPath = path.join(extractPath, file);

    const res = await supabase.storage
      .from("ai_modules")
      .upload(`${moduleName}/${file}`, fs.createReadStream(fullPath), {
        upsert: true,
      });

    uploaded.push({
      file,
      supabase_path: `${moduleName}/${file}`,
    });

    console.log("UPLOAD OK:", `${moduleName}/${file}`);
  }

  // 3. metadata genereren
  const metadata = {
    name: moduleName,
    created_at: new Date().toISOString(),
    files: uploaded,
  };

  fs.writeFileSync(
    path.join(extractPath, "module.json"),
    JSON.stringify(metadata, null, 2)
  );

  // 4. registreren in index
  saveToIndex(metadata);

  // 5. zip verplaatsen
  fs.renameSync(zipPath, path.join(PROCESSED, zipName));

  console.log("=== MODULE ENGINE: Klaar:", moduleName);
}

export function startModuleEngine() {
  console.log("AO MODULE ENGINE actief op:", TMP);

  fs.watch(TMP, (event, file) => {
    if (!file) return;
    if (!file.endsWith(".zip")) return;

    const zipPath = path.join(TMP, file);

    // kleine delay zodat upload compleet is
    setTimeout(() => {
      processZip(zipPath);
    }, 500);
  });
}
