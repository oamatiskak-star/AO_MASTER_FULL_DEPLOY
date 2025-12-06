import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function uploadToSupabase(filePath, filename) {
  console.log("Upload naar Supabase gestart:", filename);

  const fileData = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("modules")
    .upload(filename, fileData, {
      upsert: true,
      contentType: "application/zip"
    });

  if (error) {
    console.error("Supabase upload error:", error);
    return;
  }

  console.log("Upload naar Supabase voltooid:", data);
}
