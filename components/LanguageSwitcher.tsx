import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, type LangCode } from '../i18n';

const LANGS: Array<{ code: LangCode; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const baseStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(88,159,241,0.12) 100%)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(88,159,241,0.3)',
    boxShadow: '0 4px 20px rgba(88,159,241,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
  } as React.CSSProperties;

  return (
    <div className="flex items-center gap-1">
      {LANGS.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          aria-label={label}
          className={`relative inline-flex items-center justify-center px-2 lg:px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden transform hover:scale-105 ${
            i18n.language.startsWith(code) ? 'text-white' : 'text-primary-800 hover:text-teal-600'
          }`}
          style={{
            ...baseStyle,
            ...(i18n.language.startsWith(code) ? {
              background: 'linear-gradient(135deg, rgba(33,75,139,0.95) 0%, rgba(88,159,241,0.9) 50%, rgba(6,147,169,0.85) 100%)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 32px rgba(33,75,139,0.4), 0 2px 16px rgba(88,159,241,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)'
            } : {})
          }}
          title={label}
        >
          <span className="relative z-10 text-lg leading-none" role="img" aria-hidden>
            {flag}
          </span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-violet-100/10 to-blue-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-lg" />
        </button>
      ))}
    </div>
  );
}

