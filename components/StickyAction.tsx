import React, { useState } from 'react';
import { Task } from '../types';
import { getTypeEmoji } from '../utils';
import { useI18n } from '../i18n/context';

interface Props {
  task: Task | undefined;
  nextTask: Task | undefined;
  onComplete: (id: string) => void;
  onUpdateStartTime: (id: string, newTime: string) => void;
}

export const StickyAction: React.FC<Props> = ({ task, nextTask, onComplete, onUpdateStartTime }) => {
  const { t } = useI18n();
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Success State
  if (!task) {
    return (
      <div className="px-6 mb-8 mt-2">
        <div className="bg-gradient-to-r from-brand-500 to-purple-500 rounded-3xl p-8 text-center text-white shadow-glow animate-float">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-black mb-1">All Clear!</h2>
            <p className="text-brand-100 font-medium opacity-90">{t('common.no_pressure')}</p>
        </div>
      </div>
    );
  }

  const handleDelay = (minutes: number) => {
    let baseTime = new Date();
    if (task.startTime) {
        const [hours, mins] = task.startTime.split(':').map(Number);
        const taskDate = new Date();
        taskDate.setHours(hours, mins, 0, 0);
        if (taskDate > baseTime) baseTime = taskDate;
    }
    baseTime.setMinutes(baseTime.getMinutes() + minutes);
    const newTimeString = baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    onUpdateStartTime(task.id, newTimeString);
    setIsRescheduling(false);
  };

  return (
    <div className="px-4 mb-10 sticky top-2 z-30 pt-2">
      <div className="bg-gray-900 rounded-[2rem] p-5 shadow-2xl text-white relative overflow-hidden">
        {/* Background gradient blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500 rounded-full blur-[60px] opacity-30"></div>

        <div className="flex justify-between items-center mb-1 relative z-10">
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{t('common.now')}</span>
             {nextTask && (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] text-gray-300 uppercase font-bold">{t('common.later')}</span>
                    <span className="text-xs font-medium truncate max-w-[80px] text-white">{nextTask.title}</span>
                </div>
            )}
        </div>

        <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 flex-shrink-0">
                    {getTypeEmoji(task.type)}
                </span>
                <div className="min-w-0 pt-1 flex-1">
                    <h2 className="text-xl font-bold leading-tight mb-1 truncate">{task.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="font-mono bg-white/10 px-2 rounded text-gray-200">{task.duration}m</span>
                        <input 
                            type="time" 
                            value={task.startTime || ''} 
                            onChange={(e) => onUpdateStartTime(task.id, e.target.value)}
                            className="bg-transparent border-none text-gray-300 focus:text-white focus:outline-none w-auto min-w-[5.5rem] font-medium"
                        />
                    </div>
                </div>
            </div>

            {isRescheduling ? (
                <div className="bg-white/10 rounded-2xl p-3 animate-fadeIn">
                     <p className="text-xs text-center text-gray-300 mb-2 font-bold uppercase tracking-wide">{t('common.when_ask')}</p>
                     <div className="grid grid-cols-3 gap-2 mb-2">
                        <button onClick={() => handleDelay(15)} className="py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold">+15m</button>
                        <button onClick={() => handleDelay(30)} className="py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold">+30m</button>
                        <button onClick={() => handleDelay(60)} className="py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold">+1h</button>
                     </div>
                     <button onClick={() => setIsRescheduling(false)} className="w-full text-xs text-gray-400 hover:text-white py-1">
                        {t('common.cancel')}
                     </button>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-3">
                    <button 
                        onClick={() => setIsRescheduling(true)}
                        className="col-span-1 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center justify-center transition-colors text-white/80 hover:text-white"
                    >
                        <span className="text-lg mb-1">⏭️</span>
                    </button>
                    <button 
                        onClick={() => onComplete(task.id)}
                        className="col-span-3 bg-white text-brand-900 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-glow flex items-center justify-center gap-2"
                    >
                        {t('common.done_excl')}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};