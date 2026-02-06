import React from 'react';
import { Task } from '../types';
import { getTypeColor, getTypeEmoji } from '../utils';

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onEditDuration: (id: string, mins: number) => void;
  onUpdateStartTime: (id: string, newTime: string) => void;
}

export const TaskCard: React.FC<Props> = ({ task, onComplete, onEditDuration, onUpdateStartTime }) => {
  return (
    <div className={`group relative flex items-center p-4 mb-4 rounded-3xl transition-all duration-300 ${task.completed ? 'opacity-40 bg-gray-50' : 'bg-white shadow-soft hover:shadow-lg hover:-translate-y-0.5'}`}>
      
      {/* Icon Bubble */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl mr-4 shadow-sm ${task.completed ? 'bg-gray-200 grayscale' : getTypeColor(task.type)}`}>
        {getTypeEmoji(task.type)}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 py-1">
        <div className="flex justify-between items-start mb-1">
            <h3 className={`font-bold text-base leading-tight truncate pr-2 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
            </h3>
            {task.isMini && <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-black tracking-wide">MINI</span>}
        </div>
        
        <div className="flex items-center text-xs font-medium text-gray-400 gap-3 mt-1">
           <span className="flex items-center gap-1">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             {task.duration}m
           </span>
           <span className="flex items-center gap-1 hover:text-brand-600 transition-colors cursor-pointer group/time">
                <span className="opacity-50">@</span> 
                <input 
                    type="time"
                    value={task.startTime || ''}
                    onChange={(e) => onUpdateStartTime(task.id, e.target.value)}
                    className="bg-transparent w-auto min-w-[3rem] focus:outline-none font-bold text-gray-500 group-hover/time:text-brand-600"
                    onClick={(e) => e.stopPropagation()}
                />
           </span>
        </div>
        
        {/* Quick actions - Pill shaped */}
        {!task.completed && (
            <div className="flex gap-2 mt-3 overflow-hidden h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">
                <div className="flex gap-1">
                    {[10, 20, 30, 45].map(min => (
                        <button 
                            key={min} 
                            onClick={() => onEditDuration(task.id, min)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${task.duration === min ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600'}`}
                        >
                            {min}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Custom Checkbox Action */}
      <button 
        onClick={() => onComplete(task.id)}
        className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-green-500 text-white scale-95' : 'bg-gray-50 text-gray-300 hover:bg-brand-50 hover:text-brand-500 hover:scale-110'}`}
        aria-label="Toggle complete"
      >
        {task.completed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
        )}
      </button>
    </div>
  );
};