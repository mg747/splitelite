import { useStore } from '@/store';
import { currencies } from '@/i18n/config';

export function useCurrency() {
  const { currency, locale } = useStore();
  
  const currencyData = currencies.find(c => c.code === currency) || currencies[0];
  
  const formatAmount = (amount: number): string => {
    const localeMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      zh: 'zh-CN',
      ja: 'ja-JP',
      pt: 'pt-BR',
      ar: 'ar-SA',
    };
    
    const intlLocale = localeMap[locale] || 'en-US';
    
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  return {
    currency,
    symbol: currencyData.symbol,
    code: currencyData.code,
    name: currencyData.name,
    formatAmount,
  };
}
