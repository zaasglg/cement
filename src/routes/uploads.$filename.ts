import { createFileRoute } from "@tanstack/react-router";
import { readFileSync, existsSync } from "fs";
import { join, extname, basename } from "path";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export const Route = createFileRoute("/uploads/$filename")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const filename = basename(params.filename); // prevent path traversal
        const filepath = join(process.cwd(), "public", "uploads", filename);

        if (!existsSync(filepath)) {
          return new Response("Not Found", { status: 404 });
        }

        const ext = extname(filename).toLowerCase();
        const contentType = MIME[ext] ?? "application/octet-stream";
        const buffer = readFileSync(filepath);

        return new Response(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
