import type { Localized } from "./i18n";

export type StockStatus = "in_stock" | "on_order";

export type Product = {
  slug: string;
  title: Localized;
  category: string; // category id
  status: StockStatus;
  price: Localized; // localized so "Цена по запросу" can fallback
  description: Localized;
  application: Localized; // область применения
  specs: { label: Localized; value: Localized }[];
  image: string;
  gallery: string[];
};

export type Procurement = {
  slug: string;
  title: Localized;
  category: string;
  deadline: string; // ISO date
  budget: Localized;
  description: Localized;
  requirements: Localized[];
};

export type Job = {
  slug: string;
  title: Localized;
  category: string;
  salary: Localized;
  location: Localized;
  responsibilities: Localized[];
  requirements: Localized[];
  conditions: Localized[];
};

export type SiteContent = {
  home: {
    metaTitle: Localized;
    metaDescription: Localized;
    heroBadge: Localized;
    heroTitle: Localized;
    heroText: Localized;
    benefits: {
      title: Localized;
      text: Localized;
    }[];
    hubs: {
      title: Localized;
      sub: Localized;
      text: Localized;
    }[];
  };
  footer: {
    companyName: Localized;
    description: Localized;
    phone: string;
    email: string;
    address: Localized;
    whatsappUrl: string;
    telegramUrl: string;
    rights: Localized;
  };
};

export type Category = { id: string; label: Localized };

export const productCategories: Category[] = [
  { id: "bulk", label: { ru: "Цемент навалом", kk: "Үйілмелі цемент", en: "Bulk cement" } },
  {
    id: "bagged",
    label: { ru: "Тарированный цемент (мешки/биг-бэги)", en: "Bagged cement (bags / big-bags)" },
  },
];

export const procurementCategories: Category[] = [
  { id: "logistics", label: { ru: "Логистика", en: "Logistics" } },
  { id: "raw", label: { ru: "Сырье", en: "Raw materials" } },
  { id: "packaging", label: { ru: "Упаковка", en: "Packaging" } },
  { id: "services", label: { ru: "Услуги/Ремонт", en: "Services / Repair" } },
];

export const jobCategories: Category[] = [
  { id: "production", label: { ru: "Производство", en: "Production" } },
  { id: "logistics", label: { ru: "Логистика", en: "Logistics" } },
  { id: "admin", label: { ru: "Администрация", en: "Administration" } },
];

export const siteContent: SiteContent = {
  home: {
    metaTitle: { ru: "ТОО Eurasian Cement — надежная основа вашего строительства" },
    metaDescription: {
      ru: "Производство и комплексные поставки высококачественного цемента по всему Казахстану. Автоматизированные технологии и строгий контроль качества по ГОСТ.",
    },
    heroBadge: { ru: "Цемент • Казахстан • ГОСТ" },
    heroTitle: { ru: "ТОО Eurasian Cement — надежная основа вашего строительства" },
    heroText: {
      ru: "Производство и комплексные поставки высококачественного цемента по всему Казахстану. Автоматизированные технологии, строгий контроль качества по ГОСТ и бесперебойная логистика для объектов любого масштаба.",
    },
    benefits: [
      {
        title: { ru: "Стабильное качество" },
        text: {
          ru: "Собственная лаборатория, испытания каждой партии и строгое соответствие стандартам ГОСТ.",
        },
      },
      {
        title: { ru: "Объемы и сроки" },
        text: {
          ru: "Автоматизированное производство и персональный логистический автопарк для бесперебойных поставок.",
        },
      },
      {
        title: { ru: "Выгодное партнерство" },
        text: {
          ru: "Прямые поставки с завода и гибкие коммерческие условия для крупных застройщиков.",
        },
      },
    ],
    hubs: [
      {
        title: { ru: "РЕАЛИЗАЦИЯ" },
        sub: { ru: "Каталог продукции" },
        text: {
          ru: "Ознакомьтесь с ассортиментом выпускаемой продукции. Продажа цемента различных марок навалом и в тарированном виде (мешки, биг-бэги).",
        },
      },
      {
        title: { ru: "ЗАКУПКИ" },
        sub: { ru: "Нам требуется" },
        text: {
          ru: "Открытый тендерный сектор ТОО Eurasian Cement. Приглашаем к сотрудничеству поставщиков сырья, упаковочных материалов, логистических и ремонтных услуг.",
        },
      },
      {
        title: { ru: "КАРЬЕРА" },
        sub: { ru: "Вакансии" },
        text: {
          ru: "Растите вместе с лидером отрасли. Ищем специалистов на производство, в логистику и коммерческий департамент.",
        },
      },
    ],
  },
  footer: {
    companyName: { ru: "ТОО Eurasian Cement" },
    description: {
      ru: "Производство и комплексные поставки высококачественного цемента по всему Казахстану.",
    },
    phone: "+7 (700) 000-00-00",
    email: "sales@eurasiancement.kz",
    address: { ru: "г. Алматы, Промышленная зона, 1" },
    whatsappUrl: "https://wa.me/77000000000",
    telegramUrl: "https://t.me/eurasiancement",
    rights: { ru: "Все права защищены.", en: "All rights reserved." },
  },
};

export const products: Product[] = [
  {
    slug: "cem-i-425n-m500-bulk",
    title: {
      ru: "Портландцемент ЦЕМ I 42,5N (М500) навалом",
      en: "Portland cement CEM I 42.5N (M500) bulk",
    },
    category: "bulk",
    status: "in_stock",
    price: { ru: "от 28 500 ₸ / тонна" },
    description: {
      ru: "Высокомарочный портландцемент ЦЕМ I 42,5N для ответственных монолитных и сборных конструкций. Поставляется навалом цементовозами. Стабильная активность, контроль качества по ГОСТ 31108-2020.",
      en: "High-grade Portland cement CEM I 42.5N for critical monolithic and precast structures. Delivered in bulk by cement tankers.",
    },
    application: {
      ru: "Монолитное домостроение, фундаменты, мосты, ЖБИ-заводы, производство высокопрочного бетона марок до B40.",
      en: "Monolithic housing, foundations, bridges, precast concrete plants, high-strength concrete up to B40.",
    },
    specs: [
      { label: { ru: "Класс прочности", en: "Strength class" }, value: { ru: "42,5N" } },
      { label: { ru: "Стандарт", en: "Standard" }, value: { ru: "ГОСТ 31108-2020" } },
      {
        label: { ru: "Начало схватывания", en: "Initial set" },
        value: { ru: "≥ 75 мин", en: "≥ 75 min" },
      },
      {
        label: { ru: "Тонкость помола", en: "Fineness" },
        value: { ru: "≥ 3000 см²/г", en: "≥ 3000 cm²/g" },
      },
      { label: { ru: "Форма поставки", en: "Supply form" }, value: { ru: "Навалом", en: "Bulk" } },
    ],
    image: "/images/product-bulk.jpg",
    gallery: ["/images/product-bulk.jpg", "/images/product-bigbag.jpg", "/images/product-bags.jpg"],
  },
  {
    slug: "cem-ii-325n-m400-bags",
    title: {
      ru: "Портландцемент ЦЕМ II/А-Ш 32,5N (М400) в мешках 50 кг",
      en: "Portland cement CEM II/A-S 32.5N (M400) 50 kg bags",
    },
    category: "bagged",
    status: "in_stock",
    price: { ru: "от 1 850 ₸ / мешок" },
    description: {
      ru: "Универсальный цемент общестроительного назначения в фасовке по 50 кг. Идеален для кладочных, штукатурных работ и частного строительства.",
      en: "Universal general-construction cement packed in 50 kg bags.",
    },
    application: {
      ru: "Кладочные и штукатурные растворы, стяжки, фундаменты малоэтажного и частного строительства, благоустройство.",
      en: "Masonry and plaster mortars, screeds, foundations for low-rise and private construction.",
    },
    specs: [
      { label: { ru: "Класс прочности", en: "Strength class" }, value: { ru: "32,5N" } },
      { label: { ru: "Фасовка", en: "Packaging" }, value: { ru: "Мешок 50 кг", en: "50 kg bag" } },
      { label: { ru: "Стандарт", en: "Standard" }, value: { ru: "ГОСТ 31108-2020" } },
      {
        label: { ru: "Хранение", en: "Storage" },
        value: { ru: "до 60 суток", en: "up to 60 days" },
      },
    ],
    image: "/images/product-bags.jpg",
    gallery: ["/images/product-bags.jpg", "/images/product-bigbag.jpg", "/images/product-bulk.jpg"],
  },
  {
    slug: "cem-i-425n-bigbag",
    title: {
      ru: "Цемент ЦЕМ I 42,5N в биг-бэгах 1000 кг",
      en: "Cement CEM I 42.5N in big-bags 1000 kg",
    },
    category: "bagged",
    status: "on_order",
    price: { ru: "Цена по запросу" },
    description: {
      ru: "Поставка цемента в мягких контейнерах биг-бэг по 1000 кг для объектов с механизированной разгрузкой. Удобное хранение и транспортировка.",
      en: "Cement supplied in 1000 kg big-bag soft containers for sites with mechanized unloading.",
    },
    application: {
      ru: "Поставки на крупные объекты с механизированной разгрузкой, удобное хранение и транспортировка без потерь.",
      en: "Supply to large sites with mechanized unloading, convenient storage and transport without losses.",
    },
    specs: [
      { label: { ru: "Класс прочности", en: "Strength class" }, value: { ru: "42,5N" } },
      {
        label: { ru: "Фасовка", en: "Packaging" },
        value: { ru: "Биг-бэг 1000 кг", en: "Big-bag 1000 kg" },
      },
      { label: { ru: "Стандарт", en: "Standard" }, value: { ru: "ГОСТ 31108-2020" } },
    ],
    image: "/images/product-bigbag.jpg",
    gallery: ["/images/product-bigbag.jpg", "/images/product-bags.jpg", "/images/product-bulk.jpg"],
  },
  {
    slug: "sulfate-resistant-bulk",
    title: {
      ru: "Сульфатостойкий цемент ССПЦ 400-Д20 навалом",
      en: "Sulfate-resistant cement SSPC 400-D20 bulk",
    },
    category: "bulk",
    status: "on_order",
    price: { ru: "Цена по запросу" },
    description: {
      ru: "Специальный сульфатостойкий цемент для конструкций, эксплуатируемых в агрессивных сульфатных средах: фундаменты, гидротехнические сооружения.",
      en: "Special sulfate-resistant cement for structures exposed to aggressive sulfate environments.",
    },
    application: {
      ru: "Фундаменты в обводнённых грунтах, гидротехнические сооружения, очистные сооружения, конструкции в агрессивных сульфатных средах.",
      en: "Foundations in water-saturated soils, hydraulic and treatment structures, elements in aggressive sulfate environments.",
    },
    specs: [
      {
        label: { ru: "Тип", en: "Type" },
        value: { ru: "Сульфатостойкий", en: "Sulfate-resistant" },
      },
      { label: { ru: "Стандарт", en: "Standard" }, value: { ru: "ГОСТ 22266-2013" } },
      { label: { ru: "Форма поставки", en: "Supply form" }, value: { ru: "Навалом", en: "Bulk" } },
    ],
    image: "/images/product-bulk.jpg",
    gallery: ["/images/product-bulk.jpg", "/images/product-bigbag.jpg", "/images/product-bags.jpg"],
  },
];

export const procurements: Procurement[] = [
  {
    slug: "auto-vyvoz-yug",
    title: {
      ru: "Услуги автовывоза цемента цементовозами (Южный регион)",
      en: "Cement haulage services by tankers (Southern region)",
    },
    category: "logistics",
    deadline: "2026-07-15",
    budget: { ru: "Договорной" },
    description: {
      ru: "Требуются услуги по перевозке цемента навалом автоцементовозами от завода до объектов клиентов в Южном регионе Казахстана. Регулярные рейсы, объем от 3000 тонн в месяц.",
      en: "Bulk cement haulage by auto-tankers from the plant to client sites in the Southern region of Kazakhstan.",
    },
    requirements: [
      { ru: "Парк цементовозов от 5 единиц", en: "Fleet of at least 5 cement tankers" },
      {
        ru: "Опыт перевозки сыпучих грузов от 3 лет",
        en: "3+ years of bulk cargo transport experience",
      },
      { ru: "Готовность к регулярным рейсам", en: "Readiness for regular trips" },
    ],
  },
  {
    slug: "gips-postavka",
    title: {
      ru: "Поставка гипсового камня для производства",
      en: "Supply of gypsum stone for production",
    },
    category: "raw",
    deadline: "2026-06-30",
    budget: { ru: "до 45 000 000 ₸", en: "up to 45 000 000 ₸" },
    description: {
      ru: "Закупка гипсового камня для технологического процесса производства цемента. Стабильные поставки, соответствие химическому составу по ТУ.",
      en: "Procurement of gypsum stone for the cement production process.",
    },
    requirements: [
      { ru: "Содержание CaSO4·2H2O не менее 80%", en: "CaSO4·2H2O content of at least 80%" },
      { ru: "Объем от 2000 тонн в месяц", en: "Volume from 2000 tons per month" },
    ],
  },
  {
    slug: "meshkotara-postavka",
    title: { ru: "Поставка бумажной мешкотары 50 кг", en: "Supply of 50 kg paper bags" },
    category: "packaging",
    deadline: "2026-06-20",
    budget: { ru: "Договорной" },
    description: {
      ru: "Требуется поставщик трёхслойных бумажных клапанных мешков для фасовки цемента по 50 кг с нанесением логотипа.",
      en: "Supplier of three-layer paper valve bags for 50 kg cement packaging with logo printing.",
    },
    requirements: [
      { ru: "Трёхслойные клапанные мешки", en: "Three-layer valve bags" },
      { ru: "Возможность брендирования", en: "Branding capability" },
    ],
  },
  {
    slug: "remont-konveyera",
    title: {
      ru: "Ремонт и обслуживание ленточных конвейеров",
      en: "Repair and maintenance of belt conveyors",
    },
    category: "services",
    deadline: "2026-08-01",
    budget: { ru: "Договорной" },
    description: {
      ru: "Подрядчик для планового и аварийного ремонта ленточных конвейерных систем на территории завода. Замена лент, роликов, юстировка.",
      en: "Contractor for scheduled and emergency repair of belt conveyor systems at the plant.",
    },
    requirements: [
      {
        ru: "Опыт обслуживания промышленных конвейеров",
        en: "Industrial conveyor maintenance experience",
      },
      { ru: "Собственная ремонтная бригада", en: "Own repair crew" },
    ],
  },
];

export const jobs: Job[] = [
  {
    slug: "operator-bsu-tehnolog",
    title: { ru: "Оператор БСУ / Технолог", en: "Mixing plant operator / Technologist" },
    category: "production",
    salary: { ru: "от 350 000 ₸" },
    location: { ru: "г. Алматы", en: "Almaty" },
    responsibilities: [
      {
        ru: "Контроль технологического процесса производства цемента",
        en: "Control of the cement production process",
      },
      { ru: "Ведение производственной документации", en: "Maintaining production documentation" },
    ],
    requirements: [
      { ru: "Высшее техническое образование", en: "Higher technical education" },
      { ru: "Опыт работы на производстве от 2 лет", en: "2+ years of production experience" },
    ],
    conditions: [
      { ru: "Официальное трудоустройство", en: "Official employment" },
      {
        ru: "Сменный график, доставка служебным транспортом",
        en: "Shift schedule, corporate transport",
      },
    ],
  },
  {
    slug: "voditel-cementovoza",
    title: { ru: "Водитель цементовоза (категория CE)", en: "Cement tanker driver (CE category)" },
    category: "logistics",
    salary: { ru: "от 450 000 ₸" },
    location: { ru: "г. Шымкент", en: "Shymkent" },
    responsibilities: [
      {
        ru: "Перевозка цемента навалом по Казахстану",
        en: "Bulk cement transport across Kazakhstan",
      },
      { ru: "Контроль технического состояния ТС", en: "Vehicle technical condition control" },
    ],
    requirements: [
      { ru: "Водительское удостоверение категории CE", en: "CE category driving license" },
      { ru: "Стаж вождения от 3 лет", en: "3+ years driving experience" },
    ],
    conditions: [
      { ru: "Стабильная заработная плата без задержек", en: "Stable salary without delays" },
      { ru: "Современный автопарк", en: "Modern fleet" },
    ],
  },
  {
    slug: "menedzher-po-prodazham",
    title: { ru: "Менеджер по продажам (B2B)", en: "Sales manager (B2B)" },
    category: "admin",
    salary: { ru: "По результатам собеседования" },
    location: { ru: "г. Алматы", en: "Almaty" },
    responsibilities: [
      {
        ru: "Развитие клиентской базы застройщиков и дилеров",
        en: "Developing a base of developers and dealers",
      },
      { ru: "Ведение переговоров и заключение договоров", en: "Negotiations and contracts" },
    ],
    requirements: [
      { ru: "Опыт активных B2B продаж от 2 лет", en: "2+ years of active B2B sales" },
      {
        ru: "Знание рынка стройматериалов будет преимуществом",
        en: "Knowledge of the building materials market is a plus",
      },
    ],
    conditions: [
      { ru: "Оклад + прогрессивный бонус с продаж", en: "Base salary + progressive sales bonus" },
      { ru: "Карьерный рост до руководителя направления", en: "Career growth to department head" },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function getProcurement(slug: string) {
  return procurements.find((p) => p.slug === slug);
}
export function getJob(slug: string) {
  return jobs.find((j) => j.slug === slug);
}

/** Mock leads store. */
export type Lead = {
  id: string;
  type: "sales" | "procurement" | "career";
  ref?: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};

const leads: Lead[] = [];

export function addLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
  const entry: Lead = {
    ...lead,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  leads.push(entry);
  return entry;
}

export function getLeads() {
  return [...leads];
}
