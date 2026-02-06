import React, { useState } from 'react';
import { I18nProvider } from './i18n/context';
import { Confetti } from './components/Confetti';
import { Layout } from './components/Layout';
import { TodayView } from './views/TodayView';
import { WeekView } from './views/WeekView';
import { SettingsView } from './views/SettingsView';
import { useFocusFlow } from './hooks/useFocusFlow';

// Inner component to use hooks that depend on Providers
const FocusFlowApp = () => {
  const [view, setView] = useState<'today' | 'week' | 'weekend' | 'settings'>('today');
  
  const {
    tasks, todayTasks, activeTasks, progress,
    preferences, currentDayIndex, setCurrentDayIndex,
    showConfetti, lastSaved, activeDateStr,
    actions
  } = useFocusFlow();

  const handleSetView = (v: 'today' | 'week' | 'weekend' | 'settings') => {
    // Removed the auto-reset date logic here. 
    // The "Today" button in Layout will now handle the specific reset to current date.
    setView(v);
  };

  const handleSelectDayFromWeek = (idx: number) => {
    setCurrentDayIndex(idx);
    setView('today');
  };

  return (
    <Layout
      currentDayIndex={currentDayIndex}
      activeDateStr={activeDateStr}
      preferences={preferences}
      view={view}
      setView={handleSetView}
      setCurrentDayIndex={setCurrentDayIndex}
      onApplyMood={actions.applyMood}
      lastSaved={lastSaved}
      onReset={actions.resetData}
    >
      <Confetti active={showConfetti} />
      
      {view === 'today' && (
        <TodayView 
          tasks={todayTasks}
          activeTasks={activeTasks}
          progress={progress}
          currentDayIndex={currentDayIndex}
          activeDateStr={activeDateStr}
          onRegenerate={actions.regenerateDay}
          onComplete={actions.handleComplete}
          onUpdateStartTime={actions.updateStartTime}
          onUpdateDuration={actions.updateDuration}
          onChaos={actions.triggerChaosMode}
          onAddWeekend={actions.addWeekendTemplate}
          onAddTask={actions.addTask}
        />
      )}

      {view === 'week' && (
        <WeekView 
          tasks={tasks}
          preferences={preferences}
          currentDayIndex={currentDayIndex}
          onToggleWfh={actions.toggleWfh}
          onRegenerate={actions.regenerateDay}
          onSelectDay={handleSelectDayFromWeek}
        />
      )}

      {view === 'settings' && (
        <SettingsView 
          preferences={preferences}
          onAddTemplate={actions.addTemplateTask}
          onRemoveTemplate={actions.removeTemplateTask}
          onEditTemplate={actions.editTemplateTask}
        />
      )}
    </Layout>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <FocusFlowApp />
    </I18nProvider>
  );
}