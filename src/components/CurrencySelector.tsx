'use client';

import { useState, useRef, useEffect } from 'react';
import { DollarSign, Check, ChevronDown } from 'lucide-react';
import { currencies, type CurrencyCode } from '@/i18n/config';
import { useStore } from '@/store';

export default function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useStore();
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

  const handleSelect = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors text-dark-300 hover:text-white"
      >
        <DollarSign className="w-4 h-4" />
        <span className="font-medium">{currentCurrency.symbol}</span>
        <span className="text-sm hidden sm:inline">{currentCurrency.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 py-2 bg-dark-800 border border-dark-600 rounded-xl shadow-xl z-50 animate-fade-in max-h-80 overflow-y-auto">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleSelect(curr.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-700 transition-colors ${
                currency === curr.code ? 'text-primary-400' : 'text-dark-300'
              }`}
            >
              <span className="w-8 font-medium">{curr.symbol}</span>
              <span className="flex-1 text-left">
                <span className="font-medium">{curr.code}</span>
                <span className="text-dark-500 text-sm ml-2">{curr.name}</span>
              </span>
              {currency === curr.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
