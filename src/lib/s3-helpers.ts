import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, BUCKET } from "../config/s3.js";

// Create presigned PUT (browser uploads directly to S3)
export async function getPresignedPutUrl(
  key: string,
  contentType: string,
  expiresSec = 100
) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ServerSideEncryption: "AES256",
  });
  return getSignedUrl(s3, cmd, { expiresIn: expiresSec });
}

// Verify object exists + get size (after upload)
export async function headObject(key: string) {
  return s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
}

// 3) Presigned GET (short-lived download URL)
export async function getPresignedGetUrl(
  key: string,
  downloadName: string,
  expiresSec = 90
) {
  const safeFilename = downloadName.replace(/["\\]/g, "\\$&");
  const encodedFilename = encodeURIComponent(downloadName);

  const cmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`,
    ResponseContentType: "application/octet-stream",
  });
  return getSignedUrl(s3, cmd, { expiresIn: expiresSec });
}

// 4) Delete object (optional admin/dev)
export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
