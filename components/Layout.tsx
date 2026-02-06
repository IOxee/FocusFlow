import React from 'react';
import { useI18n } from '../i18n/context';
import { UserPreferences } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentDayIndex: number;
  activeDateStr: string;
  preferences: UserPreferences;
  view: 'today' | 'week' | 'weekend' | 'settings';
  setView: (v: 'today' | 'week' | 'weekend' | 'settings') => void;
  setCurrentDayIndex: (idx: number) => void;
  onApplyMood: (m: 'ko' | 'normal' | 'motivated') => void;
  lastSaved: Date | null;
  onReset: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, currentDayIndex, activeDateStr, preferences, 
  view, setView, setCurrentDayIndex, onApplyMood, lastSaved, onReset 
}) => {
  const { t, tDay, language, setLanguage } = useI18n();

  const formatDate = (dateStr: string) => {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}`;
  };

  const handleTodayClick = () => {
    const day = new Date().getDay();
    const target = day === 0 ? 6 : day - 1;
    setCurrentDayIndex(target);
    setView('today');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#F9FAFB] sm:border-x sm:border-gray-200 overflow-hidden relative font-sans text-gray-900 flex flex-col">
      {/* Header - Transparent & Clean */}
      <header className="px-6 py-5 flex justify-between items-center bg-[#F9FAFB]/80 backdrop-blur-md sticky top-0 z-40">
        <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">FocusFlow</h1>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">
              {tDay(currentDayIndex)} <span className="text-gray-300">•</span> {formatDate(activeDateStr)}
            </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-1 bg-white p-1 rounded-full shadow-sm border border-gray-100">
                {['ko', 'normal', 'motivated'].map((m) => (
                    <button
                        key={m}
                        onClick={() => onApplyMood(m as any)}
                        className={`w-7 h-7 rounded-full text-xs transition-all flex items-center justify-center ${preferences.mood === m ? 'bg-gray-900 text-white scale-105 shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        {m === 'ko' ? '🔋' : m === 'normal' ? '⚡' : '🔥'}
                    </button>
                ))}
            </div>
            <button 
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="text-[10px] font-bold text-gray-400 hover:text-brand-600 transition-colors"
            >
              {language.toUpperCase()}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto overflow-x-hidden">
        {children}
        
        {/* Footer Links */}
        {view === 'settings' && (
          <div className="text-center p-8 pb-32">
              <div className="text-[10px] text-gray-400 mb-3 flex items-center justify-center gap-1 font-medium">
                  {lastSaved && <span>Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
              </div>
              <button onClick={onReset} className="text-xs text-red-300 hover:text-red-500 font-bold tracking-wide">
                  {t('common.reset_data')}
              </button>
          </div>
        )}
      </main>

      {/* Floating Nav */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <nav className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-soft rounded-full px-6 py-3 flex gap-8 pointer-events-auto items-center">
            <button 
                onClick={handleTodayClick} 
                className={`transition-all duration-300 ${view === 'today' ? 'text-brand-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={view === 'today' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </button>
            <button 
                onClick={() => setView('week')} 
                className={`transition-all duration-300 ${view === 'week' ? 'text-brand-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={view === 'week' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </button>
            <button 
                onClick={() => { setCurrentDayIndex(5); setView('today'); }} 
                className={`transition-all duration-300 ${currentDayIndex > 4 && view !== 'settings' ? 'text-brand-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a2 2 0 0 0-2-2h-3l-1.5 2.5"></path></svg>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button 
                onClick={() => setView('settings')} 
                className={`transition-all duration-300 ${view === 'settings' ? 'text-brand-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={view === 'settings' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
        </nav>
      </div>
    </div>
  );
};