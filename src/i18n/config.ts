export const locales = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
  pt: 'Português',
  ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  zh: '🇨🇳',
  ja: '🇯🇵',
  pt: '🇧🇷',
  ar: '🇸🇦',
};

// RTL languages
export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

// Supported currencies with their locales
export const currencies: { code: string; symbol: string; name: string; locales: string[] }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locales: ['en'] },
  { code: 'EUR', symbol: '€', name: 'Euro', locales: ['fr', 'de', 'es', 'pt'] },
  { code: 'GBP', symbol: '£', name: 'British Pound', locales: ['en'] },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locales: ['ja'] },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locales: ['zh'] },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locales: ['en'] },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locales: ['pt'] },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locales: ['en'] },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locales: ['en', 'fr'] },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', locales: ['es'] },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locales: ['ar'] },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locales: ['ar'] },
];

export type CurrencyCode = string;

// Get default currency for a locale
export function getDefaultCurrency(locale: Locale): CurrencyCode {
  const currency = currencies.find(c => c.locales.includes(locale));
  return currency?.code || 'USD';
}

// Detect user's preferred locale from browser
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const browserLang = navigator.language.split('-')[0];
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }
  
  return defaultLocale;
}
