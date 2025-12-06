import fs from "fs";
import path from "path";
import unzipper from "unzipper";

const WATCH_DIR = path.resolve("tmp_uploads");

console.log("AO MODULE ENGINE: gestart");
console.log("Watching:", WATCH_DIR);

// Zorg dat de map bestaat
if (!fs.existsSync(WATCH_DIR)) {
    fs.mkdirSync(WATCH_DIR, { recursive: true });
}

fs.watch(WATCH_DIR, async (eventType, filename) => {
    if (!filename) return;

    const fullPath = path.join(WATCH_DIR, filename);

    if (!filename.endsWith(".zip")) return;

    console.log("Nieuw ZIP bestand gedetecteerd:", filename);

    try {
        const extractPath = path.join(WATCH_DIR, filename.replace(".zip", ""));

        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }

        fs.createReadStream(fullPath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on("close", () => {
                console.log("ZIP uitgepakt:", extractPath);

                // Later kunnen we dit koppelen aan:
                // - Supabase upload
                // - GitHub push
                // - Vercel trigger
                // - AI workers starten
            });
    } catch (err) {
        console.error("Fout bij verwerken ZIP:", err);
    }
});
