import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "ru" | "kk" | "en";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "kk", label: "KZ" },
  { code: "en", label: "EN" },
];

/** A localized string. RU is required and acts as the fallback. */
export type Localized = { ru: string; kk?: string; en?: string };

/** Resolve a localized field for the active language, falling back to RU. */
export function t(field: Localized | undefined, lang: Lang): string {
  if (!field) return "";
  const value = field[lang];
  if (value && value.trim().length > 0) return value;
  return field.ru;
}

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: (field: Localized | undefined) => string;
  ui: (key: keyof typeof UI) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "ec-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const value: I18nContextValue = {
    lang,
    setLang,
    tr: (field) => t(field, lang),
    ui: (key) => t(UI[key], lang),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** UI label dictionary. RU primary, KZ/EN with intentional fallbacks. */
export const UI = {
  nav_home: { ru: "Главная", kk: "Басты бет", en: "Home" },
  nav_products: { ru: "Реализация", kk: "Сату", en: "Products" },
  nav_procurement: { ru: "Закупки", kk: "Сатып алу", en: "Procurement" },
  nav_careers: { ru: "Карьера", kk: "Мансап", en: "Careers" },
  contact_sales: { ru: "Связаться с отделом продаж", kk: "Сату бөлімімен байланысу", en: "Contact sales" },
  go_catalog: { ru: "Перейти в каталог", kk: "Каталогқа өту", en: "Go to catalog" },
  view_needs: { ru: "Посмотреть потребности", en: "View needs" },
  open_vacancies: { ru: "Открытые вакансии", en: "Open vacancies" },
  all: { ru: "Все", kk: "Барлығы", en: "All" },
  in_stock: { ru: "В наличии", kk: "Қоймада бар", en: "In stock" },
  on_order: { ru: "Под заказ", en: "On order" },
  price_request: { ru: "Цена по запросу", en: "Price on request" },
  request_price: { ru: "Запросить прайс", en: "Request price" },
  request_quote: { ru: "Запросить прайс", en: "Request a quote" },
  deadline: { ru: "Срок подачи", en: "Deadline" },
  budget: { ru: "Бюджет", en: "Budget" },
  respond_task: { ru: "Откликнуться на задачу", en: "Respond to task" },
  respond_vacancy: { ru: "Откликнуться на вакансию", en: "Apply for the job" },
  salary: { ru: "Зарплата", en: "Salary" },
  location: { ru: "Локация", en: "Location" },
  category: { ru: "Категория", en: "Category" },
  back: { ru: "Назад", en: "Back" },
  specs: { ru: "Технические характеристики", en: "Technical specifications" },
  responsibilities: { ru: "Обязанности", en: "Responsibilities" },
  requirements: { ru: "Требования", en: "Requirements" },
  conditions: { ru: "Условия работы", en: "Working conditions" },
  details: { ru: "Детали потребности", en: "Requirement details" },
  form_name: { ru: "Имя / Компания", en: "Name / Company" },
  form_name_short: { ru: "Имя", en: "Name" },
  form_phone: { ru: "Телефон", en: "Phone" },
  form_message: { ru: "Сообщение", en: "Message" },
  form_experience: { ru: "Кратко об опыте / Сопроводительное письмо", en: "Brief experience / Cover letter" },
  submit: { ru: "Отправить", kk: "Жіберу", en: "Submit" },
  cancel: { ru: "Отмена", kk: "Бас тарту", en: "Cancel" },
  success: { ru: "Успешно отправлено!", kk: "Сәтті жіберілді!", en: "Successfully sent!" },
  success_desc: { ru: "Мы свяжемся с вами в ближайшее время.", en: "We will contact you shortly." },
  not_found: { ru: "Не найдено", en: "Not found" },
  footer_contacts: { ru: "Контакты", en: "Contacts" },
  footer_company: { ru: "Компания", en: "Company" },
  footer_rights: { ru: "Все права защищены.", en: "All rights reserved." },
} satisfies Record<string, Localized>;
