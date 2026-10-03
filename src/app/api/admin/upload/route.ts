import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isValidPasscode, passcodeFromRequest } from "@/lib/admin-auth";

/**
 * POST /api/admin/upload
 * Headers: x-admin-passcode
 * Body: multipart/form-data with a "file" field (PNG / JPG / WebP, ≤ 5 MB).
 *
 * Stores the image under `public/uploads/` and returns its public path,
 * ready to be used as an image path anywhere in the site content.
 */

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  if (!isValidPasscode(passcodeFromRequest(request))) {
    return NextResponse.json(
      { ok: false, error: "دسترسی غیرمجاز." },
      { status: 401 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "فایل دریافتی نامعتبر است." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { ok: false, error: "فایلی ارسال نشده است." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "حجم فایل باید کمتر از ۵ مگابایت باشد." },
      { status: 413 },
    );
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { ok: false, error: "فقط تصاویر PNG، JPG و WebP پذیرفته می‌شوند." },
      { status: 415 },
    );
  }

  /* unique, filesystem-safe name — original name is never reused */
  const uniqueId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const filename = `upload-${uniqueId}.${extension}`;

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(
      path.join(uploadsDir, filename),
      Buffer.from(await file.arrayBuffer()),
    );
    return NextResponse.json({ ok: true, path: `/uploads/${filename}` });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ذخیره‌سازی فایل با خطا مواجه شد." },
      { status: 500 },
    );
  }
}
