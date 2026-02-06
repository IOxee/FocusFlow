import { useState, useEffect, useMemo } from 'react';
import { Task, UserPreferences, TaskType, TaskTemplate } from '../types';
import { DEFAULT_PREFERENCES, generateDailyPlan, getWeekendTemplates, createDefaultTemplates } from '../constants';
import { playSuccessSound, getDateOfCurrentWeek } from '../utils';
import { useI18n } from '../i18n/context';

const STORAGE_KEY = 'focusflow_data_v1';

export const useFocusFlow = () => {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const activeDateStr = useMemo(() => getDateOfCurrentWeek(currentDayIndex), [currentDayIndex]);

  // --- Load & Migration ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let loadedTasks: Task[] = parsed.tasks || [];
        let loadedPrefs: UserPreferences = parsed.preferences || DEFAULT_PREFERENCES;
        
        // Migration: Ensure customTemplates exist
        if (!loadedPrefs.customTemplates || (!loadedPrefs.customTemplates.office && !loadedPrefs.customTemplates.wfh)) {
            const defaults = createDefaultTemplates(t);
            loadedPrefs = {
                ...loadedPrefs,
                customTemplates: defaults
            };
        }

        // Migration logic for dates
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        loadedTasks = loadedTasks.map(task => {
            if (!task.date) return { ...task, date: todayStr };
            return task;
        });

        setTasks(loadedTasks);
        setPreferences(loadedPrefs);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    } else {
        // Initial load generation
        const defaults = createDefaultTemplates(t);
        const initialPrefs = { ...DEFAULT_PREFERENCES, customTemplates: defaults };
        setPreferences(initialPrefs);

        const isWeekend = currentDayIndex > 4;
        if (!isWeekend) {
            // Use local regeneration logic but with the new prefs we just created
            const isWFH = initialPrefs.wfhDays.includes(currentDayIndex);
            const newTasks = generateDailyPlan(currentDayIndex, isWFH ? 'wfh' : 'office', activeDateStr, initialPrefs, t);
            setTasks(newTasks);
        }
    }
  }, []); // Run once on mount

  // --- Save ---
  useEffect(() => {
    if (preferences) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, preferences }));
        setLastSaved(new Date());
    }
  }, [tasks, preferences]);

  // --- Logic ---
  
  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.date === activeDateStr).sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const timeA = a.startTime || '23:59';
        const timeB = b.startTime || '23:59';
        return timeA.localeCompare(timeB);
    });
  }, [tasks, activeDateStr]);

  const progress = useMemo(() => {
    const total = todayTasks.length;
    if (total === 0) return 0;
    const done = todayTasks.filter(t => t.completed).length;
    return Math.round((done / total) * 100);
  }, [todayTasks]);

  const regenerateDay = (dayIdx: number, dateStr: string) => {
    const isWFH = preferences.wfhDays.includes(dayIdx);
    const newTasks = generateDailyPlan(dayIdx, isWFH ? 'wfh' : 'office', dateStr, preferences, t);
    setTasks(prev => [...prev.filter(t => t.date !== dateStr), ...newTasks]);
  };

  const addTask = (title: string, duration: number, type: TaskType, startTime?: string) => {
    const newTask: Task = {
        id: `${activeDateStr}-custom-${Date.now()}`,
        title,
        duration,
        type,
        completed: false,
        dayIndex: currentDayIndex,
        date: activeDateStr,
        isMini: false,
        isFixed: false,
        startTime: startTime || undefined
    };
    setTasks(prev => [...prev, newTask]);
  };
  
  const editTask = (id: string, updates: Partial<Task>) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // --- Template Management ---
  const addTemplateTask = (mode: 'office' | 'wfh', title: string, duration: number, type: TaskType, startTime?: string) => {
      const newTemplate: TaskTemplate = {
          id: `tpl-${Date.now()}`,
          title,
          duration,
          type,
          startTime,
          isFixed: !!startTime // If it has a time, assume fixed for now
      };
      setPreferences(prev => ({
          ...prev,
          customTemplates: {
              ...prev.customTemplates,
              [mode]: [...(prev.customTemplates[mode] || []), newTemplate].sort((a,b) => (a.startTime || '23:59').localeCompare(b.startTime || '23:59'))
          }
      }));
  };

  const editTemplateTask = (mode: 'office' | 'wfh', templateId: string, updates: Partial<TaskTemplate>) => {
    setPreferences(prev => ({
        ...prev,
        customTemplates: {
            ...prev.customTemplates,
            [mode]: prev.customTemplates[mode].map(t => 
                t.id === templateId ? { ...t, ...updates, isFixed: !!updates.startTime || t.isFixed } : t
            ).sort((a,b) => (a.startTime || '23:59').localeCompare(b.startTime || '23:59'))
        }
    }));
  };

  const removeTemplateTask = (mode: 'office' | 'wfh', templateId: string) => {
    setPreferences(prev => ({
        ...prev,
        customTemplates: {
            ...prev.customTemplates,
            [mode]: prev.customTemplates[mode].filter(t => t.id !== templateId)
        }
    }));
  };

  const handleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      if (preferences.useSound) playSuccessSound();
      if (preferences.useConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    }
  };

  const updateStartTime = (id: string, newTime: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, startTime: newTime } : t));
  };

  const updateDuration = (id: string, mins: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, duration: mins } : t));
  };

  const triggerChaosMode = () => {
    setTasks(prev => {
        // Check if we are already in chaos mode for this day (if any uncompleted task is mini)
        const isChaosActive = prev.some(t => t.date === activeDateStr && !t.completed && t.isMini);

        return prev.map(task => {
            if (task.date !== activeDateStr || task.completed) return task;

            if (isChaosActive) {
                // Restore logic
                return {
                    ...task,
                    duration: task.originalDuration || task.duration,
                    isMini: false
                    // We don't change title back because we rely on badges now, title wasn't changed in new logic
                };
            } else {
                // Activate Chaos Logic
                let newDuration = task.duration;
                // Only reduce "heavy" tasks
                if (task.type === 'study' || task.type === 'exercise' || task.type === 'work') {
                    newDuration = Math.max(10, Math.floor(task.duration * 0.3));
                }
                
                return {
                    ...task,
                    originalDuration: task.duration, // Save current duration
                    duration: newDuration,
                    isMini: true
                    // We keep title clean, UI handles "Mini" label
                };
            }
        });
    });
  };

  const applyMood = (mood: 'ko' | 'normal' | 'motivated') => {
    setPreferences(p => ({ ...p, mood }));
    const multiplier = mood === 'ko' ? 0.5 : mood === 'motivated' ? 1.2 : 1;
    setTasks(prev => prev.map(t => {
      if (t.date !== activeDateStr || t.completed || t.isFixed) return t;
      return { ...t, duration: Math.max(5, Math.round(t.duration * multiplier)) };
    }));
  };

  const toggleWfh = (dayIdx: number) => {
    setPreferences(prev => {
        const isWFH = prev.wfhDays.includes(dayIdx);
        const newWfh = isWFH 
            ? prev.wfhDays.filter(x => x !== dayIdx)
            : [...prev.wfhDays, dayIdx];
        return { ...prev, wfhDays: newWfh };
    });
  };

  const addWeekendTemplate = (templateKey: 'relax' | 'chores' | 'study') => {
    const templates = getWeekendTemplates(t);
    const template = templates[templateKey];
    
    // Explicit type mapping to satisfy TaskType definition
    const newTasks: Task[] = template.map((item, idx) => ({
      id: `we-${Date.now()}-${idx}`,
      title: item.title,
      type: item.type as TaskType,
      duration: item.duration,
      completed: false,
      dayIndex: currentDayIndex,
      date: activeDateStr,
      isMini: false,
      isFixed: false,
      startTime: undefined
    }));
    setTasks(prev => [...prev, ...newTasks]);
  };

  const resetData = () => {
      if (window.confirm(t('common.confirm_reset'))) {
          localStorage.removeItem(STORAGE_KEY);
          window.location.reload();
      }
  };

  return {
    tasks,
    todayTasks,
    activeTasks: todayTasks.filter(t => !t.completed),
    preferences,
    currentDayIndex,
    setCurrentDayIndex,
    showConfetti,
    lastSaved,
    activeDateStr,
    progress,
    actions: {
        regenerateDay,
        addTask,
        editTask,
        addTemplateTask,
        editTemplateTask,
        removeTemplateTask,
        handleComplete,
        updateStartTime,
        updateDuration,
        triggerChaosMode,
        applyMood,
        addWeekendTemplate,
        toggleWfh,
        resetData
    }
  };
};