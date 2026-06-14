import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { submitLead } from "@/lib/api/data.functions";
import type { Lead } from "@/lib/mock-data";

type Props = {
  trigger: ReactNode;
  title: string;
  type: Lead["type"];
  refSlug?: string;
  messageLabel: string;
  nameLabel: string;
};

export function LeadFormModal({ trigger, title, type, refSlug, messageLabel, nameLabel }: Props) {
  const { ui } = useI18n();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({ data: { type, ref: refSlug, ...form } });
      setForm({ name: "", phone: "", message: "" });
      setOpen(false);
      toast.success(ui("success"), {
        description: ui("success_desc"),
        icon: <CheckCircle2 className="h-5 w-5 text-brand" />,
      });
    } catch {
      toast.error("Ошибка отправки. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{ui("success_desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">{nameLabel}</Label>
            <Input
              id="lead-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">{ui("form_phone")}</Label>
            <Input
              id="lead-phone"
              type="tel"
              required
              placeholder="+7 (___) ___-__-__"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-message">{messageLabel}</Label>
            <Textarea
              id="lead-message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              {ui("cancel")}
            </Button>
            <Button type="submit" variant="brand" disabled={loading}>
              {loading ? "Отправка..." : ui("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
