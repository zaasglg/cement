import { createFileRoute } from "@tanstack/react-router";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let formData: FormData;
        try {
          formData = await request.formData();
        } catch {
          return json({ error: "Invalid form data" }, 400);
        }

        const file = formData.get("file");
        if (!file || typeof file === "string") {
          return json({ error: "No file provided" }, 400);
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          return json({ error: "Недопустимый тип файла. Разрешены: JPG, PNG, WebP, GIF, AVIF" }, 400);
        }

        if (file.size > MAX_SIZE) {
          return json({ error: "Файл слишком большой (макс. 10 МБ)" }, 400);
        }

        const uploadsDir = join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

        const ext = extname(file.name).toLowerCase() || ".jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const filepath = join(uploadsDir, filename);

        const buffer = Buffer.from(await file.arrayBuffer());
        writeFileSync(filepath, buffer);

        return json({ url: `/uploads/${filename}` }, 200);
      },
    },
  },
});

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
