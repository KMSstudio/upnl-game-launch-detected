/* /app/api/upload/image/route.js */

// Next
import { NextResponse } from "next/server";
// Utils
import { uploadImageToS3 } from "@/utils/aws/imageS3";

/**
 * POST /api/image/upload
 * 파일을 받아서 S3에 업로드하고 URL 반환
 */
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const url = await uploadImageToS3(buffer, file.name);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Image upload failed:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}