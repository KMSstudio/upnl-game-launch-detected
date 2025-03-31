/* @/utils/aws/s3.js */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import { v4 as uuid } from "uuid";

// S3 설정
const s3 = new S3Client({
  region: process.env.AWS_PRCY_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PRCY_ACCESS_KEY,
    secretAccessKey: process.env.AWS_PRCY_SECRET_KEY,
  },
});

const S3_BUCKET_NAME = process.env.AWS_S3_PROJCOVER_BUCKET;

/**
 * 파일을 S3에 업로드하고, 공개 URL을 반환한다.
 * @param {Buffer} fileBuffer - 파일 버퍼
 * @param {string} originalName - 원본 파일명 (확장자 포함)
 * @returns {Promise<string>} - 업로드된 이미지의 S3 URL
 */
export async function uploadImageToS3(fileBuffer, originalName) {
  const fileId = uuid().slice(0, 20);
  const ext = originalName.split(".").pop();
  const fileName = `${fileId}.${ext}`;
  const mimeType = mime.lookup(originalName) || "image/png";
  const s3Key = `image/${fileName}`;

  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read",
  }));

  return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
}