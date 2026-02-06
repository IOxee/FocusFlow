import React from 'react';
import { Task, UserPreferences } from '../types';
import { useI18n } from '../i18n/context';
import { getDateOfCurrentWeek } from '../utils';

interface Props {
  tasks: Task[];
  preferences: UserPreferences;
  currentDayIndex: number;
  onToggleWfh: (idx: number) => void;
  onRegenerate: (idx: number, date: string) => void;
  onSelectDay: (idx: number) => void;
}

export const WeekView: React.FC<Props> = ({
  tasks, preferences, currentDayIndex, onToggleWfh, onRegenerate, onSelectDay
}) => {
  const { t } = useI18n();
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']; // Could also be translated but single letter usually universal-ish or configured
  
  return (
    <div className="p-4 pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('common.week')}</h2>
      <div className="grid gap-4">
          {days.map((d, idx) => {
              if (idx > 4) return null; 
              const isWFH = preferences.wfhDays.includes(idx);
              const thisDateStr = getDateOfCurrentWeek(idx);
              const dayTasks = tasks.filter(t => t.date === thisDateStr);
              const completedCount = dayTasks.filter(t => t.completed).length;
              const totalCount = dayTasks.length;
              
              return (
                  <div key={idx} className={`bg-white p-4 rounded-xl border ${idx === currentDayIndex ? 'border-brand-500 shadow-md' : 'border-gray-100'}`}>
                      <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-lg w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">{d}</span>
                          <button 
                              onClick={() => onToggleWfh(idx)}
                              className={`text-xs px-2 py-1 rounded border ${isWFH ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                          >
                              {isWFH ? `🏠 ${t('common.wfh')}` : `🏢 ${t('common.office')}`}
                          </button>
                      </div>
                      
                      <div className="flex gap-2 text-sm text-gray-500 mb-3">
                          <span>{completedCount}/{totalCount} {t('common.tasks')}</span>
                          {completedCount === totalCount && totalCount > 0 && <span>🏆</span>}
                      </div>

                      <div className="flex gap-2">
                           <button 
                              onClick={() => onRegenerate(idx, thisDateStr)}
                              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded flex-1"
                           >
                              {t('common.regenerate')}
                           </button>
                           {idx !== currentDayIndex && (
                               <button 
                                  onClick={() => onSelectDay(idx)}
                                  className="text-xs border border-gray-200 text-gray-600 px-3 py-2 rounded"
                              >
                                  {t('common.view')}
                              </button>
                           )}
                      </div>
                  </div>
              )
          })}
      </div>
    </div>
  )
};