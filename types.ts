export type TaskType = 'water' | 'food' | 'work' | 'study' | 'exercise' | 'other' | 'break';

export type DayMode = 'office' | 'wfh' | 'weekend';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  startTime?: string; // HH:mm string for sorting/display
  duration: number; // in minutes
  originalDuration?: number; // Used to restore state after Chaos Mode
  completed: boolean;
  dayIndex: number; // 0 = Monday, 6 = Sunday
  date: string; // YYYY-MM-DD unique identifier for the specific day
  isMini: boolean; // True if shrunk by Chaos Mode
  isFixed: boolean; // If true, harder to move (like meetings)
}

export interface TaskTemplate {
  id: string;
  title: string;
  type: TaskType;
  duration: number;
  startTime?: string; // Optional default start time
  isFixed: boolean;
}

export interface UserPreferences {
  officeDays: number[]; // [1, 2, 3] -> Tue, Wed, Thu
  wfhDays: number[]; // [0, 4] -> Mon, Fri
  useSound: boolean;
  useConfetti: boolean;
  mood: 'ko' | 'normal' | 'motivated';
  customTemplates: {
    office: TaskTemplate[];
    wfh: TaskTemplate[];
  };
}

export interface AppState {
  tasks: Task[];
  currentDate: string; // ISO Date string to track "today"
  preferences: UserPreferences;
}