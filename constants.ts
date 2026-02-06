import { Task, UserPreferences, TaskType, TaskTemplate } from './types';

export const DEFAULT_PREFERENCES: UserPreferences = {
  officeDays: [1, 2, 3], // Tue, Wed, Thu
  wfhDays: [0, 4], // Mon, Fri
  useSound: true,
  useConfetti: true,
  mood: 'normal',
  customTemplates: {
    office: [],
    wfh: []
  }
};

// Helper to create initial default templates if none exist
export const createDefaultTemplates = (t: (key: string) => string): { office: TaskTemplate[], wfh: TaskTemplate[] } => {
  const commonStart: TaskTemplate[] = [
    { id: 't-water', title: t('tasks.water'), type: 'water', duration: 5, startTime: '07:00', isFixed: true },
  ];

  const office: TaskTemplate[] = [
    ...commonStart,
    { id: 't-tea', title: t('tasks.tea'), type: 'water', duration: 15, startTime: '09:30', isFixed: false },
    { id: 't-lunch1', title: t('tasks.lunch1_office'), type: 'food', duration: 20, startTime: '11:00', isFixed: true },
    { id: 't-lunch2', title: t('tasks.lunch2_office'), type: 'food', duration: 45, startTime: '14:00', isFixed: true },
    { id: 't-dinner', title: t('tasks.dinner'), type: 'food', duration: 45, startTime: '21:00', isFixed: true },
  ];

  const wfh: TaskTemplate[] = [
    ...commonStart,
    { id: 't-lunch1', title: t('tasks.lunch1_wfh'), type: 'food', duration: 30, startTime: '11:00', isFixed: true },
    { id: 't-lunch2', title: t('tasks.lunch2_wfh'), type: 'food', duration: 45, startTime: '14:00', isFixed: true },
    { id: 't-dinner', title: t('tasks.dinner'), type: 'food', duration: 45, startTime: '21:00', isFixed: true },
  ];

  return { office, wfh };
};

// Generates a daily plan based on the USER PREFERENCES TEMPLATES
export const generateDailyPlan = (
    dayIndex: number, 
    mode: 'office' | 'wfh', 
    dateStr: string,
    preferences: UserPreferences,
    t: (key: string) => string
): Task[] => {
  const tasks: Task[] = [];
  const idBase = `${dateStr}-${Date.now()}`;

  // Get the template list based on mode
  const templates = preferences.customTemplates[mode] || [];

  // Convert templates to actual tasks
  templates.forEach((tpl, idx) => {
    tasks.push({
      id: `${idBase}-${tpl.id}-${idx}`,
      title: tpl.title,
      type: tpl.type,
      duration: tpl.duration,
      startTime: tpl.startTime,
      isFixed: tpl.isFixed,
      completed: false,
      dayIndex,
      date: dateStr,
      isMini: false
    });
  });

  // Dynamic Habits (Hardcoded for now as "Smart suggestions", could be moved to settings later)
  // These are appended if they fit the day
  if ([0, 2, 4].includes(dayIndex)) { // Mon, Wed, Fri
    tasks.push({
      id: `${idBase}-exercise`,
      title: t('tasks.exercise'),
      type: 'exercise',
      duration: dayIndex === 2 ? 40 : 45,
      completed: false,
      dayIndex,
      date: dateStr,
      isMini: false,
      isFixed: false,
      startTime: '18:00'
    });
  }

  if ([0, 1, 3].includes(dayIndex)) { // Mon, Tue, Thu
    tasks.push({
      id: `${idBase}-study`,
      title: t('tasks.study'),
      type: 'study',
      duration: dayIndex === 0 ? 60 : 45,
      completed: false,
      dayIndex,
      date: dateStr,
      isMini: false,
      isFixed: false,
      startTime: '19:00'
    });
  }

  return tasks.sort((a, b) => (a.startTime || '23:59').localeCompare(b.startTime || '23:59'));
};

export const getWeekendTemplates = (t: (key: string) => string) => ({
  relax: [
    { title: t('tasks.read'), type: 'break', duration: 30 },
    { title: t('tasks.walk'), type: 'exercise', duration: 30 },
    { title: t('tasks.tasty_food'), type: 'food', duration: 60 }
  ],
  chores: [
    { title: t('tasks.laundry'), type: 'work', duration: 15 },
    { title: t('tasks.supermarket'), type: 'work', duration: 60 },
    { title: t('tasks.meal_prep'), type: 'food', duration: 90 }
  ],
  study: [
    { title: t('tasks.test'), type: 'study', duration: 45 },
    { title: t('tasks.review'), type: 'study', duration: 20 }
  ]
});