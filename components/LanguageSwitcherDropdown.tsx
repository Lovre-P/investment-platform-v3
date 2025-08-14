import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LangCode } from '../i18n';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FLAGS: Record<LangCode, string> = {
  en: '🇬🇧',
  hr: '🇭🇷',
  de: '🇩🇪',
  fr: '🇫🇷',
  it: '🇮🇹'
};

const LABELS: Record<LangCode, string> = {
  en: 'English',
  hr: 'Hrvatski',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano'
};

export default function LanguageSwitcherDropdown() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && btnRef.current && !btnRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const current = (i18n.language?.split('-')[0] as LangCode) || 'en';
  const flag = FLAGS[current] || '🌐';

  const baseStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(88,159,241,0.12) 100%)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(88,159,241,0.3)',
    boxShadow: '0 4px 20px rgba(88,159,241,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
  };

  const activeStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(33,75,139,0.95) 0%, rgba(88,159,241,0.9) 50%, rgba(6,147,169,0.85) 100%)',
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: '0 8px 32px rgba(33,75,139,0.4), 0 2px 16px rgba(88,159,241,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)'
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen(v => !v)}
        className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden transform hover:scale-105 ${open ? 'text-white' : 'text-primary-800 hover:text-teal-600'}`}
        style={open ? activeStyle : baseStyle}
      >
        <span className="text-lg" aria-hidden>{flag}</span>
        <ChevronDownIcon className="h-4 w-4" aria-hidden />
        <span className="sr-only">Language</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-violet-100/10 to-blue-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-lg" />
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 mt-2 min-w-[160px] rounded-2xl p-2 z-50"
          style={{
            ...baseStyle,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 30%, rgba(88,159,241,0.2) 100%)'
          }}
        >
          {(['en','hr','de','fr','it'] as LangCode[]).map(code => (
            <button
              key={code}
              role="option"
              aria-selected={current === code}
              onClick={() => { i18n.changeLanguage(code); setOpen(false); }}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${current === code ? 'bg-primary-100/60 text-primary-900' : 'text-primary-800 hover:bg-primary-50'}`}
            >
              <span className="text-lg" aria-hidden>{FLAGS[code]}</span>
              <span className="text-sm font-medium">{LABELS[code]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

