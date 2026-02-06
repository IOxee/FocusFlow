import React, { createContext, useContext, useState, useEffect } from 'react';
import { resources, Language } from './locales';

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tDay: (dayIndex: number) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // 1. Check local storage
    const savedLang = localStorage.getItem('focusflow_lang') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguageState(savedLang);
    } else {
      // 2. Check browser
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
      setLanguageState(browserLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('focusflow_lang', lang);
  };

  // Helper to access nested keys roughly
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = resources[language];
    
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    return typeof current === 'string' ? current : path;
  };

  const tDay = (index: number) => {
    return resources[language].days[index % 7];
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tDay }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};