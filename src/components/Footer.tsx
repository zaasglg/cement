import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { SiteContent } from "@/lib/mock-data";

type FooterContent = SiteContent["footer"];

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function Footer({ content }: { content: FooterContent }) {
  const { tr, ui } = useI18n();

  return (
    <footer id="footer" className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground font-black">
              EC
            </span>
            <span className="text-base font-bold">{tr(content.companyName)}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            {tr(content.description)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            {ui("footer_contacts")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-brand" />
              <a href={phoneHref(content.phone)} className="hover:text-brand">
                {content.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-brand" />
              <a href={`mailto:${content.email}`} className="hover:text-brand">
                {content.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-brand" />
              <span>{tr(content.address)}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            {ui("footer_company")}
          </h3>
          <div className="mt-4 flex gap-3">
            <a
              href={content.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={content.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              <Send className="h-4 w-4" /> Telegram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-primary-foreground/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {tr(content.companyName)}.{" "}
          {tr(content.rights) || ui("footer_rights")}
        </div>
      </div>
    </footer>
  );
}
