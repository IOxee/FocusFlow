import React, { useState } from 'react';
import { StickyAction } from '../components/StickyAction';
import { TaskCard } from '../components/TaskCard';
import { AddTaskModal } from '../components/AddTaskModal';
import { Task, TaskType } from '../types';
import { useI18n } from '../i18n/context';

interface Props {
  tasks: Task[];
  activeTasks: Task[];
  progress: number;
  currentDayIndex: number;
  activeDateStr: string;
  onRegenerate: (idx: number, date: string) => void;
  onComplete: (id: string) => void;
  onUpdateStartTime: (id: string, time: string) => void;
  onUpdateDuration: (id: string, mins: number) => void;
  onChaos: () => void;
  onAddWeekend: (type: 'relax' | 'chores' | 'study') => void;
  onAddTask: (title: string, duration: number, type: TaskType, startTime?: string) => void;
}

export const TodayView: React.FC<Props> = ({
  tasks, activeTasks, progress, currentDayIndex, activeDateStr,
  onRegenerate, onComplete, onUpdateStartTime, onUpdateDuration, onChaos, onAddWeekend, onAddTask
}) => {
  const { t, tDay } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const nextTask = activeTasks[0];
  const followingTask = activeTasks[1];
  
  // Check if chaos mode is active (any uncompleted task is mini)
  const isChaosActive = activeTasks.some(t => t.isMini);

  const handleModalSubmit = (data: { title: string, duration: number, type: TaskType, startTime?: string }) => {
      onAddTask(data.title, data.duration, data.type, data.startTime);
  };

  // Weekend Empty State
  if (currentDayIndex > 4 && tasks.length === 0) {
    return (
      <div className="p-8 text-center h-[70vh] flex flex-col justify-center">
         <h2 className="text-3xl font-black text-gray-800 mb-3">{t('common.free_weekend')}</h2>
         <p className="text-gray-400 font-medium mb-10 text-lg">{t('common.no_pressure')}</p>
         
         <div className="space-y-4 max-w-xs mx-auto w-full">
           <button onClick={() => onAddWeekend('relax')} className="w-full bg-teal-50 text-teal-700 p-5 rounded-3xl font-bold hover:bg-teal-100 hover:scale-105 transition-all shadow-sm">
             {t('modes.relax')}
           </button>
           <button onClick={() => onAddWeekend('chores')} className="w-full bg-orange-50 text-orange-700 p-5 rounded-3xl font-bold hover:bg-orange-100 hover:scale-105 transition-all shadow-sm">
             {t('modes.chores')}
           </button>
           <button onClick={() => onAddWeekend('study')} className="w-full bg-purple-50 text-purple-700 p-5 rounded-3xl font-bold hover:bg-purple-100 hover:scale-105 transition-all shadow-sm">
             {t('modes.study')}
           </button>
         </div>
         
         <div className="mt-12">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-200 transition-all pb-1"
            >
                {t('common.or_custom')} {t('common.add_task')}
            </button>
         </div>
         <AddTaskModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleModalSubmit} 
         />
      </div>
    );
  }

  // Empty Weekday
  if (tasks.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                📅
            </div>
            <p className="text-gray-400 font-medium text-lg mb-8">{t('common.no_plan')} {tDay(currentDayIndex)}.</p>
            <button onClick={() => onRegenerate(currentDayIndex, activeDateStr)} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all w-full max-w-xs">
                {t('common.generate_plan')}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="mt-6 text-brand-600 font-bold text-sm hover:underline">
                + {t('common.add_task')}
            </button>
            <AddTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleModalSubmit} 
            />
        </div>
    )
  }

  return (
    <div className="pb-32 relative min-h-full">
      <StickyAction 
          task={nextTask} 
          nextTask={followingTask}
          onComplete={onComplete}
          onUpdateStartTime={onUpdateStartTime}
      />

      <div className="px-6">
          <div className="flex justify-between items-end mb-4">
              <h3 className="font-black text-gray-300 text-xs tracking-widest uppercase">{t('common.timeline')}</h3>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  {progress}% Complete
              </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-8 overflow-hidden shadow-inner">
              <div 
                  className="bg-gradient-to-r from-brand-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${progress}%` }}
              ></div>
          </div>

          <div className="space-y-4">
              {tasks.map((task, idx) => (
                  <div key={task.id} className="relative">
                      {/* Connector Line */}
                      {idx !== tasks.length - 1 && (
                          <div className="absolute left-8 top-12 bottom-[-20px] w-0.5 bg-gray-100 -z-10"></div>
                      )}
                      <TaskCard 
                          task={task} 
                          onComplete={onComplete}
                          onEditDuration={onUpdateDuration}
                          onUpdateStartTime={onUpdateStartTime}
                      />
                  </div>
              ))}
          </div>

          {activeTasks.length > 2 && (
              <div className="mt-12 mb-4">
                  <button 
                      onClick={onChaos}
                      className={`w-full border-2 border-dashed p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                        isChaosActive 
                          ? 'border-green-300 text-green-600 bg-green-50 hover:bg-green-100' 
                          : 'border-red-200 text-red-300 hover:bg-red-50 hover:text-red-400 hover:border-red-300'
                      }`}
                  >
                      <span>{isChaosActive ? '🌿' : '🆘'}</span>
                      <span>{isChaosActive ? t('common.exit_chaos') : t('common.chaos_mode')}</span>
                  </button>
              </div>
          )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6 z-30">
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-3xl pb-1 hover:bg-black hover:scale-110 active:scale-95 transition-all"
        >
            +
        </button>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};