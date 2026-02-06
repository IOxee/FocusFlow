import React, { useState, useEffect } from 'react';
import { TaskType } from '../types';
import { useI18n } from '../i18n/context';

interface TaskData {
    title: string;
    duration: number;
    type: TaskType;
    startTime?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
  initialValues?: TaskData;
  isEditing?: boolean;
}

export const AddTaskModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialValues, isEditing = false }) => {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [type, setType] = useState<TaskType>('work');
  const [startTime, setStartTime] = useState('');

  // Reset or load initial values when modal opens
  useEffect(() => {
    if (isOpen) {
        if (initialValues) {
            setTitle(initialValues.title);
            setDuration(initialValues.duration);
            setType(initialValues.type);
            setStartTime(initialValues.startTime || '');
        } else {
            setTitle('');
            setDuration(30);
            setType('work');
            setStartTime('');
        }
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, duration, type, startTime: startTime || undefined });
    onClose();
  };

  const types: TaskType[] = ['work', 'study', 'food', 'exercise', 'break', 'other'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10">
        <h2 className="text-xl font-black text-gray-800 mb-4">
            {isEditing ? t('common.edit_task') : t('common.new_task')}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('common.title')}</label>
                <input 
                    autoFocus
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 focus:border-brand-500 focus:outline-none font-medium"
                    placeholder="..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('common.duration')}</label>
                    <input 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 focus:border-brand-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('common.optional_time')}</label>
                    <input 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 focus:border-brand-500 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('common.type')}</label>
                <div className="flex flex-wrap gap-2">
                    {types.map(tKey => (
                        <button
                            key={tKey}
                            type="button"
                            onClick={() => setType(tKey)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${type === tKey ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
                        >
                            {t(`taskTypes.${tKey}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
                >
                    {t('common.cancel')}
                </button>
                <button 
                    type="submit" 
                    disabled={!title.trim()}
                    className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEditing ? t('common.save') : t('common.add')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};