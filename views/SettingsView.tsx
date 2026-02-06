import React, { useState } from 'react';
import { UserPreferences, TaskType, TaskTemplate } from '../types';
import { getTypeColor, getTypeEmoji } from '../utils';
import { useI18n } from '../i18n/context';
import { AddTaskModal } from '../components/AddTaskModal';

interface Props {
  preferences: UserPreferences;
  onAddTemplate: (mode: 'office' | 'wfh', title: string, duration: number, type: TaskType, startTime?: string) => void;
  onRemoveTemplate: (mode: 'office' | 'wfh', id: string) => void;
  onEditTemplate: (mode: 'office' | 'wfh', id: string, updates: Partial<TaskTemplate>) => void;
}

export const SettingsView: React.FC<Props> = ({ preferences, onAddTemplate, onRemoveTemplate, onEditTemplate }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'office' | 'wfh'>('office');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);

  const templates = preferences.customTemplates?.[activeTab] || [];

  const handleEditClick = (tpl: TaskTemplate) => {
      setEditingTemplate(tpl);
      setIsModalOpen(true);
  };

  const handleModalSubmit = (data: { title: string, duration: number, type: TaskType, startTime?: string }) => {
      if (editingTemplate) {
          onEditTemplate(activeTab, editingTemplate.id, data);
      } else {
          onAddTemplate(activeTab, data.title, data.duration, data.type, data.startTime);
      }
      setEditingTemplate(null);
  };

  const handleClose = () => {
      setIsModalOpen(false);
      setEditingTemplate(null);
  };

  return (
    <div className="pb-24 p-4">
      <h2 className="text-2xl font-black text-gray-800 mb-2">{t('common.edit_routines')}</h2>
      <p className="text-sm text-gray-500 mb-6">{t('common.routine_desc')}</p>

      {/* Tabs */}
      <div className="flex bg-gray-200 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('office')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'office' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🏢 {t('common.office')}
        </button>
        <button
          onClick={() => setActiveTab('wfh')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'wfh' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🏠 {t('common.wfh')}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {templates.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
             <p className="text-gray-400 text-sm">{t('common.empty_routine')}</p>
          </div>
        )}
        {templates.map(tpl => (
          <div key={tpl.id} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTypeColor(tpl.type)}`}>
                {getTypeEmoji(tpl.type)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{tpl.title}</h4>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>⏱ {tpl.duration}m</span>
                  {tpl.startTime && <span className="bg-gray-100 px-1 rounded">🕒 {tpl.startTime}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => handleEditClick(tpl)}
                    className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50"
                    title={t('common.edit_task')}
                >
                    ✏️
                </button>
                <button
                    onClick={() => onRemoveTemplate(activeTab, tpl.id)}
                    className="p-2 bg-gray-50 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50"
                    title={t('common.delete')}
                >
                    🗑
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button 
        onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }}
        className="w-full mt-6 py-4 border-2 border-dashed border-brand-300 text-brand-600 rounded-xl font-bold hover:bg-brand-50 transition-colors flex items-center justify-center gap-2"
      >
        <span>+</span> {t('common.add_task')}
      </button>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        onSubmit={handleModalSubmit}
        initialValues={editingTemplate || undefined}
        isEditing={!!editingTemplate}
      />
    </div>
  );
};