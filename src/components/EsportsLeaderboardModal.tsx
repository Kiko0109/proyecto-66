import React, { useState } from 'react';
import { Trophy, Flame, Shield, X, Award, ChevronRight, Activity, Users, Star, Zap } from 'lucide-react';
import { playCyberSound } from '../utils/speechUtils';

interface EsportsLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlayerRanking {
  rank: number;
  name: string;
  team: string;
  skill: number;
  sr: number;
  winLoss: string;
  streak: string;
  progressPct: number;
  hero: string;
  avatarBg: string;
  tagColor: string;
}

const TOP_10_PLAYERS: PlayerRanking[] = [
  {
    rank: 1,
    name: 'AETHER',
    team: 'T1',
    skill: 2950,
    sr: 2950,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 92,
    hero: 'Jett / Duelist',
    avatarBg: 'from-amber-500/30 to-amber-900/50',
    tagColor: 'border-amber-400 text-amber-300'
  },
  {
    rank: 2,
    name: 'SHADOW',
    team: 'FNATIC',
    skill: 2880,
    sr: 2880,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 88,
    hero: 'Omen / Controller',
    avatarBg: 'from-orange-500/30 to-orange-900/50',
    tagColor: 'border-orange-400 text-orange-300'
  },
  {
    rank: 3,
    name: 'NOVA',
    team: 'NAVI',
    skill: 2825,
    sr: 2825,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 84,
    hero: 'Sova / Initiator',
    avatarBg: 'from-amber-600/30 to-yellow-900/50',
    tagColor: 'border-yellow-400 text-yellow-300'
  },
  {
    rank: 4,
    name: 'AETHER',
    team: 'T1',
    skill: 2920,
    sr: 2560,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 78,
    hero: 'Reyna / Duelist',
    avatarBg: 'from-purple-500/30 to-purple-900/50',
    tagColor: 'border-purple-400 text-purple-300'
  },
  {
    rank: 5,
    name: 'HORON',
    team: 'T1',
    skill: 2990,
    sr: 2350,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 72,
    hero: 'Breach / Initiator',
    avatarBg: 'from-teal-500/30 to-teal-900/50',
    tagColor: 'border-teal-400 text-teal-300'
  },
  {
    rank: 6,
    name: 'CYPHER_MAX',
    team: 'PROYECTO 66',
    skill: 2850,
    sr: 2320,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 69,
    hero: 'Cypher / Sentinel',
    avatarBg: 'from-cyan-500/30 to-cyan-900/50',
    tagColor: 'border-cyan-400 text-cyan-300'
  },
  {
    rank: 7,
    name: 'YAN_AI',
    team: 'COMMAND',
    skill: 2790,
    sr: 2360,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 67,
    hero: 'Viper / Controller',
    avatarBg: 'from-emerald-500/30 to-emerald-900/50',
    tagColor: 'border-emerald-400 text-emerald-300'
  },
  {
    rank: 8,
    name: 'ANNOR',
    team: 'T1.1',
    skill: 2730,
    sr: 2330,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 64,
    hero: 'Fade / Initiator',
    avatarBg: 'from-red-500/30 to-red-900/50',
    tagColor: 'border-red-400 text-red-300'
  },
  {
    rank: 9,
    name: 'KUKO_SNIPER',
    team: 'MILITARY 66',
    skill: 2680,
    sr: 2380,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 61,
    hero: 'Chamber / Sentinel',
    avatarBg: 'from-blue-500/30 to-blue-900/50',
    tagColor: 'border-blue-400 text-blue-300'
  },
  {
    rank: 10,
    name: 'KIKO_DEV',
    team: 'ELITE CLAN',
    skill: 2610,
    sr: 2330,
    winLoss: '75-15',
    streak: '8W',
    progressPct: 58,
    hero: 'Brimstone / Controller',
    avatarBg: 'from-indigo-500/30 to-indigo-900/50',
    tagColor: 'border-indigo-400 text-indigo-300'
  }
];

export const EsportsLeaderboardModal: React.FC<EsportsLeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [selectedSeason, setSelectedSeason] = useState('Season 5');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#050b18] border-2 border-[#00f0ff]/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.4)] overflow-hidden">
        {/* Holographic Header Bar */}
        <div className="relative px-4 sm:px-6 py-4 bg-gradient-to-r from-[#030914] via-[#081830] to-[#030914] border-b border-[#00f0ff]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-blue-700 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.6)]">
              <div className="w-full h-full bg-[#050b18] rounded-[10px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#00f0ff] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-cyan-950 border border-cyan-400/50 text-[#00f0ff] uppercase">
                  Live Rankings
                </span>
                <span className="text-xs font-mono text-cyan-300/80 uppercase tracking-widest">
                  Global Championship 2024
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                ESPORTS WORLD SERIES
                <span className="text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                  TOP 10 PLAYERS
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-950/80 border border-blue-400 text-blue-300">
              {selectedSeason}
            </span>
            <button
              onClick={() => {
                playCyberSound('click');
                onClose();
              }}
              className="p-2 rounded-xl bg-[#0a1830] hover:bg-rose-950/60 text-gray-400 hover:text-rose-400 border border-gray-700 hover:border-rose-500/50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stadium Arena Background Photo / Hologram Canvas */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d2242] via-[#050e1d] to-[#02060f]">
          {/* Top Banner Notice */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 font-mono text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                <strong>Sincronización en Vivo:</strong> Servidor de Liga Proyecto 66 conectado. Torneo de Call of Duty, MMORPG y Casino Activo.
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                1,420 En Línea
              </span>
              <span>Actualizado hace 12s</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-cyan-500/30 bg-[#061224]/80 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-cyan-500/30 bg-[#071936] text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
                  <th className="py-3 px-3 text-center">Rank</th>
                  <th className="py-3 px-3">Player / Team</th>
                  <th className="py-3 px-3">Avatar / Hero</th>
                  <th className="py-3 px-3 text-right">Skill Rating (SR)</th>
                  <th className="py-3 px-3 text-center">Win / Loss</th>
                  <th className="py-3 px-3 text-center">Streak</th>
                  <th className="py-3 px-4">Last Game</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-900/40 font-mono">
                {TOP_10_PLAYERS.map((p) => {
                  const isTop3 = p.rank <= 3;
                  const rankBadgeClass =
                    p.rank === 1
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                      : p.rank === 2
                      ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-black font-black shadow-[0_0_10px_rgba(203,213,225,0.5)]'
                      : p.rank === 3
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white font-black shadow-[0_0_10px_rgba(180,83,9,0.5)]'
                      : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800';

                  return (
                    <tr
                      key={p.rank}
                      className={`transition-colors hover:bg-cyan-900/20 ${
                        p.rank === 1 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${rankBadgeClass}`}
                        >
                          {p.rank}
                        </span>
                      </td>

                      {/* Player & Team */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${p.tagColor}`}>
                            {p.team}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">SKILL: {p.skill}</div>
                      </td>

                      {/* Avatar & Hero */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.avatarBg} border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-white`}
                          >
                            {p.name.substring(0, 2)}
                          </div>
                          <span className="text-cyan-200 text-xs">{p.hero}</span>
                        </div>
                      </td>

                      {/* SR */}
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-white font-bold text-sm">{p.sr}</span>
                      </td>

                      {/* Win/Loss */}
                      <td className="py-2.5 px-3 text-center text-gray-300">
                        {p.winLoss}
                      </td>

                      {/* Streak */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-bold">
                          {p.streak}
                        </span>
                      </td>

                      {/* Last Game Progress Bar */}
                      <td className="py-2.5 px-4 min-w-[130px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-cyan-950 border border-cyan-800/80 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-[#00f0ff] shadow-[0_0_8px_#00f0ff]"
                              style={{ width: `${p.progressPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-cyan-300">{p.progressPct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#030a16] via-[#06142a] to-[#030a16] border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white">Premio de Temporada:</span>
                <span className="text-cyan-300 ml-1">
                  50,000 $WARC + Trofeo de Campeón Mundial Proyecto 66
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                playCyberSound('click');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              Cerrar Clasificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
