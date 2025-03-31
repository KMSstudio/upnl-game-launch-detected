/* @/utils/database/projDB.js */

import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const projCollection = db.collection(process.env.FIRE_DB_PROJ_TABLE);

// Cache
let projCache = new Map(), cacheTimestamps = new Map();
const CACHE_TTL = (process.env.TTL_PROJ_DB).split("*").map(Number).reduce((a, b) => a * b, 1);

// Helper: normalize tags
const parseList = (v) => Array.isArray(v) ? v : (typeof v === "string" ? (JSON.parse(v.replace(/'/g, '"')) || []) : []);
const normalizeProj = (proj) => ({
  ...proj,
  tag: parseList(proj.tag),
  "core-tag": parseList(proj["core-tag"]),
});

/**
 * Get one project by ID
 */
export async function getDBProj(id) {
  try {
    const now = Date.now();
    if (projCache.has(id) && now - cacheTimestamps.get(id) < CACHE_TTL) {
      return normalizeProj(JSON.parse(projCache.get(id)));
    }

    const doc = await projCollection.doc(id).get();
    if (!doc.exists) throw new Error("Project not found");

    const data = { id: doc.id, ...doc.data() };
    projCache.set(id, JSON.stringify(data));
    cacheTimestamps.set(id, now);
    return normalizeProj(data);
  } catch (err) {
    console.error(`Failed to get project ${id}:`, err);
    throw err;
  }
}

/**
 * Get all projects
 */
export async function getAllDBProjs() {
  try {
    const now = Date.now();
    if (projCache.has("all_projs") && now - cacheTimestamps.get("all_projs") < CACHE_TTL) {
      return JSON.parse(projCache.get("all_projs")).map(normalizeProj);
    }

    const snapshot = await projCollection.get();
    const result = [];
    snapshot.forEach(doc => result.push({ id: doc.id, ...doc.data() }));

    projCache.set("all_projs", JSON.stringify(result));
    cacheTimestamps.set("all_projs", now);
    return result.map(normalizeProj);
  } catch (err) {
    console.error("Failed to get all projects:", err);
    throw err;
  }
}

/**
 * Create a new project
 */
export async function createDBProj(projData) {
  try {
    if (!projData.id) throw new Error("Missing project id");
    await projCollection.doc(projData.id).set(projData);
    projCache.set(projData.id, JSON.stringify(projData));
    cacheTimestamps.set(projData.id, Date.now());
    projCache.delete("all_projs");
  } catch (err) {
    console.error("Failed to create project:", err);
    throw err;
  }
}

/**
 * Update a project
 */
export async function updateDBProj(id, updateData) {
  try {
    if (!id || typeof updateData !== "object") throw new Error("Invalid update");
    await projCollection.doc(id).update(updateData);

    const cached = JSON.parse(projCache.get(id) || "{}");
    projCache.set(id, JSON.stringify({ ...cached, ...updateData }));
    cacheTimestamps.set(id, Date.now());
    projCache.delete("all_projs");
  } catch (err) {
    console.error(`Failed to update project ${id}:`, err);
    throw err;
  }
}

/**
 * Delete a project
 */
export async function deleteDBProj(id) {
  try {
    await projCollection.doc(id).delete();
    projCache.delete(id);
    cacheTimestamps.delete(id);
    projCache.delete("all_projs");
  } catch (err) {
    console.error(`Failed to delete project ${id}:`, err);
    throw err;
  }
}