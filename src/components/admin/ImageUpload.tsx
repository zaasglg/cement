import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUpload({ value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Ошибка загрузки");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Ошибка сети");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const hasImage = !!value && !value.startsWith("/images/placeholder");

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      )}

      {/* Preview */}
      {hasImage && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-28 w-40 rounded-lg border border-border object-cover bg-muted"
            onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
          uploading
            ? "border-brand/50 bg-brand/5"
            : "border-border hover:border-brand/50 hover:bg-accent/50"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
            <p className="text-sm text-muted-foreground">Загрузка...</p>
          </>
        ) : (
          <>
            {hasImage ? (
              <Upload className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {hasImage ? "Заменить фото" : "Перетащите фото или нажмите для выбора"}
            </p>
            <p className="text-xs text-muted-foreground/60">JPG, PNG, WebP · до 10 МБ</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
