'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { useStore } from '@/store';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    // Reload to apply new translations
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors text-dark-300 hover:text-white"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="text-sm hidden sm:inline">{localeNames[locale]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-dark-800 border border-dark-600 rounded-xl shadow-xl z-50 animate-fade-in">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelect(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-700 transition-colors ${
                locale === loc ? 'text-primary-400' : 'text-dark-300'
              }`}
            >
              <span className="text-lg">{localeFlags[loc]}</span>
              <span className="flex-1 text-left">{localeNames[loc]}</span>
              {locale === loc && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
