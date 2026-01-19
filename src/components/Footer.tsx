'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Mail, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-900/50 border-t border-dark-700 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold gradient-text">{t('common.appName')}</span>
            <span className="text-dark-500">•</span>
            <span className="text-dark-400 text-sm">{t('common.tagline')}</span>
          </div>
          
          {/* Contact */}
          <div className="flex items-center gap-6">
            <a 
              href="mailto:customersupport@splitelite.com"
              className="flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">customersupport@splitelite.com</span>
            </a>
          </div>
          
          {/* Copyright */}
          <div className="flex items-center gap-1 text-dark-500 text-sm">
            <span>© {currentYear} SplitElite. All rights reserved.</span>
          </div>
        </div>
        
        {/* Links */}
        <div className="mt-4 pt-4 border-t border-dark-800 flex flex-wrap items-center justify-center gap-6 text-sm">
          <a href="#" className="text-dark-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-dark-400 hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-dark-400 hover:text-white transition-colors">Help Center</a>
          <span className="flex items-center gap-1 text-dark-500">
            Made with <Heart className="w-3 h-3 text-red-400" /> for expense sharing
          </span>
        </div>
      </div>
    </footer>
  );
}
