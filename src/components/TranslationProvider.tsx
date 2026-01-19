'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { isRtl } from '@/i18n/config';

// Import all message files
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import zh from '../../messages/zh.json';
import ja from '../../messages/ja.json';
import pt from '../../messages/pt.json';
import ar from '../../messages/ar.json';

const messages = { en, es, fr, de, zh, ja, pt, ar };

export default function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Update document direction for RTL languages
    document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  if (!mounted) {
    return null;
  }

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages[locale]}
      timeZone="UTC"
    >
      {children}
    </NextIntlClientProvider>
  );
}
