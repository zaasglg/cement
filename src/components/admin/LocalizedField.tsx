import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Localized } from "@/lib/i18n";

const LANGS = ["ru", "kk", "en"] as const;

type Props = {
  value: Localized;
  onChange: (v: Localized) => void;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
};

export function LocalizedField({ value, onChange, multiline, required, placeholder }: Props) {
  return (
    <div className="space-y-2">
      {LANGS.map((lang) => (
        <div key={lang} className="flex items-start gap-3">
          <span className="mt-2.5 w-7 shrink-0 text-xs font-semibold text-muted-foreground">
            {lang.toUpperCase()}
          </span>
          {multiline ? (
            <Textarea
              required={required && lang === "ru"}
              rows={2}
              value={value[lang] ?? ""}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              placeholder={lang === "ru" ? (placeholder ?? "Обязательно") : "Опционально"}
            />
          ) : (
            <Input
              required={required && lang === "ru"}
              value={value[lang] ?? ""}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              placeholder={lang === "ru" ? (placeholder ?? "Обязательно") : "Опционально"}
            />
          )}
        </div>
      ))}
    </div>
  );
}
