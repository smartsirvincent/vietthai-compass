import "server-only";
import { createHash } from "crypto";

type UploadResult = {
  secure_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  error?: { message?: string };
};

function cloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || ""
  };
}

export function isCloudinaryConfigured() {
  const config = cloudinaryConfig();
  return Boolean(config.cloudName && config.apiKey && config.apiSecret);
}

function signUpload(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

export async function uploadImageToCloudinary(file: File, folder = "vietthai-compass") {
  const config = cloudinaryConfig();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary 尚未設定，請先在 Vercel 加入 CLOUDINARY_CLOUD_NAME、CLOUDINARY_API_KEY、CLOUDINARY_API_SECRET。");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("請上傳圖片檔案。");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { folder, timestamp };
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", config.apiKey);
  body.set("timestamp", timestamp);
  body.set("folder", folder);
  body.set("signature", signUpload(params, config.apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body
  });
  const result = (await response.json()) as UploadResult;

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "Cloudinary 圖片上傳失敗。");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id || "",
    width: result.width || 0,
    height: result.height || 0
  };
}
