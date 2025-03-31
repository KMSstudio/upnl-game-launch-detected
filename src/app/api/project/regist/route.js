/* @/app/api/project/regist/route.js */

// Next
import { NextResponse } from "next/server";
// Utils
import { registerProject } from "@/utils/project/regist";

/**
 * POST /api/project/regist
 * Receives project data and registers it to Firestore
 */
export async function POST(req) {
  try {
    const body = await req.json();

    // Attempt to register the project
    const result = await registerProject(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[ProjectRegist]", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 400 }
    );
  }
}