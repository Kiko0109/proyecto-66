import React from 'react';
import { AppMode } from '../types';
import { Shield, BookOpen, Gamepad2, Skull, Brain } from 'lucide-react';

interface AppModeSwitcherProps {
  currentApp: AppMode;
  onSelectApp: (app: AppMode) => void;
  neonIntensity: 'high' | 'medium' | 'subtle';
}

export const AppModeSwitcher: React.FC<AppModeSwitcherProps> = ({
  currentApp,
  onSelectApp,
  neonIntensity
}) => {
  const apps: { id: AppMode; label: string; badge: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'deadlan',
      label: 'DEAD LAN',
      badge: '🧟 3D LAN',
      icon: <Skull className="w-3.5 h-3.5 text-rose-500" />,
      desc: 'Supervivencia Zombi P2P'
    },
    {
      id: 'mundox',
      label: 'MUNDOX AI',
      badge: '🧠 Soberano',
      icon: <Brain className="w-3.5 h-3.5 text-cyan-400" />,
      desc: 'Asistente IA VPS & Android'
    },
    {
      id: 'juegos',
      label: 'Games Hub',
      badge: '3 Juegos',
      icon: <Gamepad2 className="w-3.5 h-3.5" />,
      desc: 'Telegram Games Hub'
    },
    {
      id: 'control',
      label: 'Control 66',
      badge: '7 Bots',
      icon: <Shield className="w-3.5 h-3.5" />,
      desc: 'Centro de mando y bots'
    }
  ];

  return (
    <div className="bg-[#030712] border-b border-[#00f0ff]/20 px-2 py-1.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5">
        <span className="text-[10px] font-mono text-gray-400 hidden sm:inline uppercase tracking-wider">
          Módulos Android:
        </span>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {apps.map((app) => {
            const isActive = currentApp === app.id;

            return (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00f0ff]/25 to-[#0088cc]/25 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.35)] font-bold'
                    : 'bg-[#050c1e] text-gray-400 hover:text-gray-200 border border-gray-800 hover:border-[#00f0ff]/40'
                }`}
              >
                <span className={isActive ? 'text-[#00f0ff]' : 'text-gray-400'}>{app.icon}</span>
                <span>{app.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                      : 'bg-black/40 text-gray-500'
                  }`}
                >
                  {app.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
