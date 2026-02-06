import { TaskType } from './types';

export const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

// Returns YYYY-MM-DD for a given day index (0-6) of the CURRENT week
// Logic: Find Monday of current week, add dayIndex days
export const getDateOfCurrentWeek = (dayIndex: number): string => {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  
  // Convert JS getDay (0=Sun) to our 0=Mon standard
  // JS: Sun=0, Mon=1, Tue=2...
  // Ours: Mon=0, Tue=1, ..., Sun=6
  const jsDayIndex = currentDay === 0 ? 6 : currentDay - 1;
  
  const diff = dayIndex - jsDayIndex;
  
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  
  // FIX: Use local time components to avoid UTC date shifting (e.g., late night usage)
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const getTypeColor = (type: TaskType): string => {
  switch (type) {
    case 'water': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'food': return 'bg-green-100 text-green-800 border-green-200';
    case 'study': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'exercise': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'work': return 'bg-slate-100 text-slate-800 border-slate-200';
    default: return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};

export const getTypeEmoji = (type: TaskType): string => {
  switch (type) {
    case 'water': return '💧';
    case 'food': return '🥗';
    case 'study': return '📚';
    case 'exercise': return '💪';
    case 'work': return '💼';
    case 'break': return '🧘';
    default: return '📝';
  }
};