import React, { useEffect, useState } from 'react';

interface Props {
  active: boolean;
}

export const Confetti: React.FC<Props> = ({ active }) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (active) {
      setParticles(Array.from({ length: 50 }, (_, i) => i));
      const timer = setTimeout(() => setParticles([]), 1000); // Clear after 1s
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-brand-500 rounded-full animate-bounce-subtle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: ['#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 4)],
            animationDuration: `${0.5 + Math.random()}s`,
            animationName: 'fall', // We'll use inline style for simplicity or predefined keyframe
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: 0.8
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-bounce-subtle {
            animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
};