/* @/utils/project/regist.js */

// Utils
import { createDBProj } from "@/utils/database/projDB";
// UUID for id
import { v4 as uuid } from "uuid";

/**
 * Register a new project and save to Firebase using createDBProj
 * @param {object} data - Project data from client
 * @returns {Promise<object>} - Success status and project ID
 */
export async function registerProject(data) {
  if (!data.title || !data.version || !data["download-url"]) { throw new Error("Missing required fields."); }

  // Generate 12-character ID
  const id = uuid().replace(/-/g, "").slice(0, 12);

  // Construct object
  const newProj = {
    id,
    title: data.title,
    version: data.version,
    "homepage-url": data["homepage-url"] || "",
    os: data.os || "",
    "download-type": data["download-type"] || "upnl",
    "download-url": data["download-url"],
    "image-sq": data["image-sq"] || "",
    "image-fl": data["image-fl"] || "",
    tag: data.tag || [],
    "core-tag": data["core-tag"] || [],
    created_at: Date.now(),
  };

  await createDBProj(newProj);
  return { success: true, id };
}