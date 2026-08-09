import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await requireAdminSession();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "vietthai-compass");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "請選擇圖片檔案。" }, { status: 400 });
    }

    const uploaded = await uploadImageToCloudinary(file, folder);
    return NextResponse.json(uploaded);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "圖片上傳失敗。" },
      { status: 500 }
    );
  }
}
