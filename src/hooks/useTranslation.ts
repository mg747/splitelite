'use client';

import { useStore } from '@/store';
import { useCallback } from 'react';

// Import all message files
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import zh from '../../messages/zh.json';
import ja from '../../messages/ja.json';
import pt from '../../messages/pt.json';
import ar from '../../messages/ar.json';

type Messages = typeof en;
type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string 
      ? T[K] extends object 
        ? `${K}.${NestedKeyOf<T[K]>}` | K
        : K 
      : never 
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<Messages>;

const messages: Record<string, Messages> = { en, es, fr, de, zh, ja, pt, ar };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if not found
    }
  }
  
  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const { locale } = useStore();
  
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const messageSet = messages[locale] || messages.en;
    let translation = getNestedValue(messageSet as unknown as Record<string, unknown>, key);
    
    // Handle parameter substitution like {name}
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }
    
    return translation;
  }, [locale]);
  
  return { t, locale };
}
