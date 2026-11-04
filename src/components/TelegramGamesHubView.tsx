import React, { useState } from 'react';
import {
  Globe,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronDown,
  Trophy,
  Swords,
  Coins,
  Shield,
  Crosshair,
  Crown,
  Sparkles,
  Users,
  Flame,
  FileText,
  AlertTriangle,
  Play,
  ArrowRight,
  Send,
  Radio,
  ExternalLink,
  Info,
  Maximize2,
  Eye,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { playCyberSound } from '../utils/speechUtils';
import { MmorpgAppView } from './MmorpgAppView';
import { CasinoAppView } from './CasinoAppView';
import { CallOfDutyAppView } from './CallOfDutyAppView';
import { EsportsLeaderboardModal } from './EsportsLeaderboardModal';
import { HubLanguage, HUB_TRANSLATIONS } from '../data/hubTranslations';

type ActiveGameMode = 'hub' | 'rpg' | 'casino' | 'comando';

export type Language = HubLanguage;

const LANGUAGE_LABELS: Record<Language, { label: string; flag: string }> = {
  es: { label: 'Español', flag: '🇪🇸' },
  en: { label: 'English', flag: '🇬🇧' },
  ru: { label: 'Русский', flag: '🇷🇺' },
  pt: { label: 'Português', flag: '🇧🇷' },
  de: { label: 'Deutsch', flag: '🇩🇪' },
  fr: { label: 'Français', flag: '🇫🇷' },
  it: { label: 'Italiano', flag: '🇮🇹' },
  tr: { label: 'Türkçe', flag: '🇹🇷' }
};

export interface TelegramGamesHubViewProps {
  onOpenPortada?: () => void;
}

export const TelegramGamesHubView: React.FC<TelegramGamesHubViewProps> = ({ onOpenPortada }) => {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('hub');
  const [language, setLanguage] = useState<Language>('es');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoTab, setSelectedPhotoTab] = useState<'hub' | 'portada' | 'botfather'>('botfather');
  const [userEmail, setUserEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [twoFactorActive, setTwoFactorActive] = useState(true);
  const [showExpulsionWarning, setShowExpulsionWarning] = useState(false);

  const t = HUB_TRANSLATIONS[language];

  // If a game is active, render that game with a persistent back-to-hub bar
  if (activeGame === 'rpg') {
    return (
      <div className="flex flex-col min-h-screen bg-[#020610] text-white">
        <div className="bg-[#040d21] border-b border-amber-500/40 px-3 py-2 flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveGame('hub');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold font-mono transition"
          >
            ← {t.backToHub}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400">⚔️ {t.card1Title} ({t.card1Sub})</span>
          </div>
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-400/50 text-cyan-300 text-xs font-mono"
          >
            <Trophy className="w-3.5 h-3.5 text-[#00f0ff]" />
            Top 10
          </button>
        </div>
        <MmorpgAppView />
        <EsportsLeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
      </div>
    );
  }

  if (activeGame === 'casino') {
    return (
      <div className="flex flex-col min-h-screen bg-[#020610] text-white">
        <div className="bg-[#0b051e] border-b border-purple-500/40 px-3 py-2 flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveGame('hub');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 text-xs font-bold font-mono transition"
          >
            ← {t.backToHub}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-400">♠️ {t.card2Title} ({t.card2Sub})</span>
          </div>
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-400/50 text-cyan-300 text-xs font-mono"
          >
            <Trophy className="w-3.5 h-3.5 text-[#00f0ff]" />
            Top 10
          </button>
        </div>
        <CasinoAppView />
        <EsportsLeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
      </div>
    );
  }

  if (activeGame === 'comando') {
    return (
      <div className="flex flex-col min-h-screen bg-[#020610] text-white">
        <div className="bg-[#05140b] border-b border-emerald-500/40 px-3 py-2 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveGame('hub');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-bold font-mono transition"
          >
            ← {t.backToHub}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400">🪖 {t.card3Title} ({t.card3Sub})</span>
          </div>
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-400/50 text-cyan-300 text-xs font-mono"
          >
            <Trophy className="w-3.5 h-3.5 text-[#00f0ff]" />
            Top 10
          </button>
        </div>
        <CallOfDutyAppView />
        <EsportsLeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
      </div>
    );
  }

  // HUB VIEW (Matches 1793783954523_a63df036.jpg)
  return (
    <div className="min-h-screen bg-[#020612] text-white font-sans selection:bg-[#00f0ff]/30 relative overflow-x-hidden">
      {/* Visual Backdrop Asset: 1793783954523_a63df036.jpg with uncropped presentation */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <img
          src="/assets/aistudio/1793783954523_a63df036.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-35 scale-105"
        />
        <img
          src="/assets/aistudio/1793783954523_a63df036.jpg"
          alt="MUNDOX Telegram Games Hub"
          className="w-full h-full object-cover object-top opacity-40 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020612]/80 via-[#020612]/60 to-[#020612]/95" />
      </div>

      {/* TOP HEADER BAR */}
      <header className="relative z-30 border-b border-[#00f0ff]/20 bg-[#030919]/90 backdrop-blur-md px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo Telegram Games Hub */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0088cc] to-[#00f0ff] p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.6)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0088cc] flex items-center justify-center">
                <Send className="w-5 h-5 text-white transform -rotate-12 translate-x-[-1px] translate-y-[-1px]" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-1.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-400 to-cyan-400">
                  MUNDOX
                </span>{' '}
                Telegram Games Hub
              </h1>
              <p className="text-[11px] font-medium text-cyan-300/80">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Portada, Foto Completa, Language, Login & 2FA badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón Ver Portada MUNDOX con Barra de Carga */}
            {onOpenPortada && (
              <button
                onClick={() => {
                  playCyberSound('click');
                  onOpenPortada();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600/40 via-rose-600/40 to-cyan-500/40 hover:from-red-600/60 hover:to-cyan-500/60 border border-cyan-400/70 text-xs text-white font-mono font-bold transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                title={t.portadaBtn}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span className="hidden sm:inline">{t.portadaBtn}</span>
                <span className="sm:hidden">Portada</span>
              </button>
            )}

            {/* Botón Ver Foto Completa (Sin Recortes) */}
            <button
              onClick={() => {
                playCyberSound('click');
                setIsPhotoModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/70 text-xs text-cyan-200 font-mono font-bold transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              title={t.fullPhotoBtn}
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">{t.fullPhotoBtn}</span>
              <span className="sm:hidden">Foto</span>
            </button>

            {/* Language Dropdown (8 Idiomas) */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071733] hover:bg-[#0c244f] border border-cyan-400/40 text-xs text-white font-medium transition shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                <Globe className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>{LANGUAGE_LABELS[language].label}</span>
                <ChevronDown className="w-3 h-3 text-cyan-300" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#071733] border border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.4)] py-1.5 z-50 animate-fadeIn max-h-72 overflow-y-auto">
                  {(['es', 'en', 'ru', 'pt', 'de', 'fr', 'it', 'tr'] as Language[]).map((lng) => (
                    <button
                      key={lng}
                      onClick={() => {
                        setLanguage(lng);
                        setIsLangOpen(false);
                        playCyberSound('click');
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-cyan-950 transition ${
                        language === lng ? 'text-[#00f0ff] font-bold bg-cyan-950/60' : 'text-gray-300'
                      }`}
                    >
                      <span>{LANGUAGE_LABELS[lng].flag}</span>
                      <span>{LANGUAGE_LABELS[lng].label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login / Register Button */}
            <button
              onClick={() => {
                playCyberSound('click');
                setIsLoginModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-xs font-bold text-white border border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.4)] transition"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.loginBtn}</span>
              <span className="sm:hidden">Cuenta</span>
            </button>

            {/* 2-Step Verification Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#051829] border border-emerald-500/50 text-xs text-emerald-300 font-mono shadow-[0_0_10px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.twoFactor}</span>
              <span className="sm:hidden">2FA</span>
            </div>
          </div>
        </div>
      </header>

      {/* HERO BANNER SECTION (Robot Mascot, Title, Security Badge) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left: 3D Cute Robot Mascot */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/30 to-purple-600/20 border-2 border-cyan-400/60 p-2 flex items-center justify-center shadow-[0_0_35px_rgba(0,240,255,0.4)] animate-pulse">
                {/* Embedded Cute Mascot SVG & Hologram Plane */}
                <div className="relative w-full h-full rounded-full bg-[#071329] flex flex-col items-center justify-center overflow-hidden">
                  {/* Hologram Paper Plane floating */}
                  <div className="absolute top-2 right-4 animate-bounce">
                    <Send className="w-6 h-6 text-[#00f0ff] transform -rotate-45 drop-shadow-[0_0_8px_#00f0ff]" />
                  </div>

                  {/* Robot Head */}
                  <div className="w-16 h-14 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-400 border-2 border-cyan-300 p-1 flex flex-col items-center justify-center shadow-lg relative">
                    {/* Headset Ears with neon blue */}
                    <div className="absolute -left-2 w-3 h-5 rounded bg-cyan-500 shadow-[0_0_8px_#00f0ff]" />
                    <div className="absolute -right-2 w-3 h-5 rounded bg-cyan-500 shadow-[0_0_8px_#00f0ff]" />
                    {/* Glowing Eyes Visor */}
                    <div className="w-12 h-6 rounded-xl bg-black border border-cyan-400 flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-ping" />
                      <div className="w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                    </div>
                  </div>

                  {/* Robot Body & Thumbs Up */}
                  <div className="mt-1 flex items-center gap-1">
                    <div className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-[10px] font-bold text-cyan-200">
                      👍 YAN 66
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Welcome Text */}
          <div className="lg:col-span-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {t.welcome}{' '}
              <span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.9)]">
                Telegram Games Hub
              </span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-cyan-100/90 font-medium tracking-wide">
              {t.platformThree}
            </p>

            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  playCyberSound('click');
                  setIsLeaderboardOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/60 text-xs font-mono font-bold text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)] transition"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{t.top10Btn}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right: Security Card */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="w-full max-w-xs p-3.5 rounded-2xl bg-gradient-to-br from-[#061530]/90 to-[#030919]/90 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                <ShieldCheck className="w-6 h-6 text-[#00f0ff]" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-white tracking-wide">
                  {t.accountSecure}
                </h3>
                <ul className="mt-1.5 space-y-1 text-[11px] text-gray-200 font-sans">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{t.gmailReg}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{t.twoFactorSec}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{t.fairPlay}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE MAIN FEATURED GAME CARDS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ================= CARD 1: AVENTURAS ÉPICAS (WOW RPG) ================= */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#161208]/90 via-[#0d0a04]/90 to-[#030302] border-2 border-amber-500/60 p-4 sm:p-5 flex flex-col justify-between shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all group">
            {/* Header: Crossed Swords */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  <Swords className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-300 tracking-wide">
                    {t.card1Title}
                  </h3>
                  <p className="text-xs font-semibold text-amber-200/80">
                    {t.card1Sub}
                  </p>
                </div>
              </div>

              {/* Graphic Banner: Knight, Castle, Dragon */}
              <div className="mt-4 relative h-44 rounded-2xl overflow-hidden border border-amber-500/40 bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/30 via-transparent to-black" />
                
                {/* Fantasy visual composition */}
                <div className="relative text-center px-4">
                  <Crown className="w-12 h-12 text-amber-400 mx-auto drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                  <span className="block mt-2 font-black text-sm text-white tracking-widest uppercase">
                    {t.card1Kingdom}
                  </span>
                  <span className="block text-[11px] text-amber-300 font-mono">
                    {t.card1Stats}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-amber-400/50 text-[10px] font-mono text-amber-300">
                  ⚔️ Nivel 60 + Raid
                </div>
              </div>

              {/* 3 Key Bullets */}
              <div className="mt-4 space-y-2 text-xs font-medium text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">👑</span>
                  <span>{t.card1B1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">👥</span>
                  <span>{t.card1B2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🏆</span>
                  <span>{t.card1B3}</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="mt-6">
              <button
                onClick={() => {
                  playCyberSound('approve');
                  setActiveGame('rpg');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.playNow}</span>
              </button>
            </div>
          </div>

          {/* ================= CARD 2: CASINO MUNDOX & EL SILO CUBANO ================= */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#1b082a]/90 via-[#0d0416]/90 to-[#030205] border-2 border-purple-500/60 p-4 sm:p-5 flex flex-col justify-between shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all group">
            {/* Header: Casino Chip */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.5)]">
                  <Coins className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-purple-300 tracking-wide">
                    {t.card2Title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-200/80">
                    {t.card2Sub}
                  </p>
                </div>
              </div>

              {/* Graphic Banner: Aces, Chips, Crown */}
              <div className="mt-4 relative h-44 rounded-2xl overflow-hidden border border-purple-500/40 bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/30 via-transparent to-black" />

                <div className="relative text-center px-4">
                  <div className="flex items-center justify-center gap-2 text-2xl">
                    <span className="p-1 rounded bg-white text-black font-black text-xs">A♠</span>
                    <span className="p-1 rounded bg-white text-red-600 font-black text-xs">A♥</span>
                  </div>
                  <span className="block mt-2 font-black text-sm text-white tracking-widest uppercase">
                    {t.card2Banner}
                  </span>
                  <span className="block text-[11px] text-purple-300 font-mono">
                    {t.card2Stats}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-purple-400/50 text-[10px] font-mono text-purple-300">
                  🎲 Silo: 4-5-6 | Casa: 10%
                </div>
              </div>

              {/* 3 Key Bullets */}
              <div className="mt-4 space-y-2 text-xs font-medium text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">♠️</span>
                  <span>{t.card2B1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🎁</span>
                  <span>{t.card2B2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🛡️</span>
                  <span>{t.card2B3}</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="mt-6">
              <button
                onClick={() => {
                  playCyberSound('approve');
                  setActiveGame('casino');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.playNow}</span>
              </button>
            </div>
          </div>

          {/* ================= CARD 3: JUEGO DE COMANDO (COD) ================= */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#081e0f]/90 via-[#040f07]/90 to-[#020503] border-2 border-emerald-500/60 p-4 sm:p-5 flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all group">
            {/* Header: Military Chevron */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                  <Crosshair className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-300 tracking-wide">
                    {t.card3Title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-200/80">
                    {t.card3Sub}
                  </p>
                </div>
              </div>

              {/* Graphic Banner: Special Ops Soldier, Tanks, Helicopters */}
              <div className="mt-4 relative h-44 rounded-2xl overflow-hidden border border-emerald-500/40 bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/30 via-transparent to-black" />

                <div className="relative text-center px-4">
                  <Shield className="w-12 h-12 text-emerald-400 mx-auto drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                  <span className="block mt-2 font-black text-sm text-white tracking-widest uppercase">
                    {t.card3Banner}
                  </span>
                  <span className="block text-[11px] text-emerald-300 font-mono">
                    {t.card3Stats}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-emerald-400/50 text-[10px] font-mono text-emerald-300">
                  🪖 18 Escuadrones Activos
                </div>
              </div>

              {/* 3 Key Bullets */}
              <div className="mt-4 space-y-2 text-xs font-medium text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎯</span>
                  <span>{t.card3B1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">👥</span>
                  <span>{t.card3B2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🎖️</span>
                  <span>{t.card3B3}</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="mt-6">
              <button
                onClick={() => {
                  playCyberSound('approve');
                  setActiveGame('comando');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.playNow}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION (3 CONTAINERS: ¿Cómo empezar?, Golden Trophy, Reglas del Juego) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Container 1: ¿Cómo empezar? (4 cols) */}
          <div className="md:col-span-4 p-5 rounded-3xl bg-gradient-to-br from-[#061530]/80 to-[#020714]/80 border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <Info className="w-5 h-5 text-[#00f0ff]" />
                <span>{t.howToStart}</span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-cyan-100 font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-[#00f0ff] font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <span>{t.step1}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-[#00f0ff] font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <span>{t.step2}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-[#00f0ff] font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </span>
                  <span>{t.step3}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-[#00f0ff] font-bold flex items-center justify-center text-xs shrink-0">
                    4
                  </span>
                  <span>{t.step4}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Container 2: Center Golden Trophy (4 cols) */}
          <div
            onClick={() => {
              playCyberSound('click');
              setIsLeaderboardOpen(true);
            }}
            className="md:col-span-4 p-5 rounded-3xl bg-gradient-to-b from-[#131102]/80 via-[#070601]/80 to-[#020201] border-2 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition"
          >
            <div className="relative">
              <Trophy className="w-16 h-16 text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-pulse" />
            </div>
            <h3 className="mt-3 text-lg font-black text-amber-300 tracking-wide uppercase">
              {t.safeFun}
            </h3>
            {/* 5 Golden Stars */}
            <div className="mt-1 flex items-center justify-center gap-1 text-amber-400">
              {'★★★★★'}
            </div>
            <p className="mt-2 text-[11px] text-amber-200/80 font-mono">
              {t.safeCommunity}
            </p>
          </div>

          {/* Container 3: Reglas del Juego (4 cols) */}
          <div className="md:col-span-4 p-5 rounded-3xl bg-gradient-to-br from-[#061530]/80 to-[#020714]/80 border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{t.rulesTitle}</span>
              </div>
              <p className="mt-1 text-xs text-gray-300">
                {t.rulesSub}
              </p>

              {/* Consent Checkbox */}
              <label className="mt-3 flex items-center gap-2.5 text-xs text-cyan-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-cyan-400 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span className={rulesAccepted ? 'font-bold text-white' : 'text-gray-400'}>
                  {t.acceptRules}
                </span>
              </label>
            </div>

            {/* Buttons: Continuar and Warning */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => {
                  if (!rulesAccepted) {
                    playCyberSound('error');
                    setShowExpulsionWarning(true);
                  } else {
                    playCyberSound('approve');
                    setActiveGame('casino');
                  }
                }}
                className={`w-full sm:flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${
                  rulesAccepted
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  playCyberSound('error');
                  setShowExpulsionWarning(true);
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-[11px] font-bold text-rose-300 transition text-center"
              >
                {t.expulsionNotice}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FULL PHOTO / PORTADA COMPLETA MODAL (Sin Recortes) */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-cyan-500/30 bg-[#030919]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>{t.photoModalTitle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-[10px] text-cyan-300">
                    100% Sin Recortes
                  </span>
                </h3>
                <p className="text-[11px] text-gray-400 font-sans">{t.photoModalSub}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab switcher */}
              <div className="flex items-center rounded-xl bg-black/60 p-1 border border-cyan-500/30 text-xs font-mono">
                <button
                  onClick={() => setSelectedPhotoTab('botfather')}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedPhotoTab === 'botfather' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  BotFather (640x360)
                </button>
                <button
                  onClick={() => setSelectedPhotoTab('hub')}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedPhotoTab === 'hub' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {t.tabHub}
                </button>
                <button
                  onClick={() => setSelectedPhotoTab('portada')}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedPhotoTab === 'portada' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {t.tabPortada}
                </button>
              </div>

              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                title={t.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Complete Image with object-contain & backlight */}
          <div className="flex-1 relative flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden bg-gradient-to-b from-[#020612] via-black to-[#050c1e]">
            {/* Ambient glow */}
            <img
              src={
                selectedPhotoTab === 'botfather'
                  ? '/assets/aistudio/mundox_botfather_640x360.jpg'
                  : selectedPhotoTab === 'portada'
                  ? '/assets/aistudio/MUNDOX_portada_89727de9.png'
                  : '/assets/aistudio/1793783954523_a63df036.jpg'
              }
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-30 scale-110 pointer-events-none"
            />
            {/* 100% Uncropped high-definition photo */}
            <img
              src={
                selectedPhotoTab === 'botfather'
                  ? '/assets/aistudio/mundox_botfather_640x360.jpg'
                  : selectedPhotoTab === 'portada'
                  ? '/assets/aistudio/MUNDOX_portada_89727de9.png'
                  : '/assets/aistudio/1793783954523_a63df036.jpg'
              }
              alt="MUNDOX Oficial Full Artwork"
              className="relative z-10 max-w-full max-h-[78vh] object-contain rounded-xl shadow-[0_0_60px_rgba(0,240,255,0.3)] border border-cyan-400/40 select-none"
            />

            {selectedPhotoTab === 'botfather' && (
              <div className="relative z-10 mt-3 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-[11px] font-mono text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2">
                <span>✓ Dimensiones Exactas: 640x360 píxeles para @BotFather</span>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-4 py-3 border-t border-cyan-500/30 bg-[#030919] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="text-gray-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Resolución Oficial Proyecto 66 • MUNDOX Telegram Games Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/assets/aistudio/mundox_botfather_640x360.jpg"
                download="mundox_640x360.jpg"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <span>💾 Descargar 640x360</span>
              </a>

              {onOpenPortada && (
                <button
                  onClick={() => {
                    setIsPhotoModalOpen(false);
                    onOpenPortada();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold transition hover:brightness-110"
                >
                  {t.portadaBtn} (85%)
                </button>
              )}
              <button
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setActiveGame('casino');
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold transition hover:bg-purple-500"
              >
                ♠️ {t.card2Title}
              </button>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 text-black font-extrabold transition hover:bg-cyan-400"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPULSION / DISCIPLINE WARNING MODAL */}
      {showExpulsionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#120407] border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.5)] text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-rose-300">
              ADVERTENCIA DE SEGURIDAD Y EXPULSIÓN
            </h3>
            <p className="text-xs text-rose-100 font-sans leading-relaxed">
              En <strong>Telegram Games Hub</strong> y <strong>Proyecto 66</strong> mantenemos tolerancia cero al fraude, multicuenta, insultos y trampas. Quien no acepte las reglas o intente vulnerar la plataforma será expulsado automáticamente y su saldo virtual confiscado por la administración.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRulesAccepted(true);
                  setShowExpulsionWarning(false);
                  playCyberSound('approve');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition"
              >
                Aceptar Reglas y Entrar
              </button>
              <button
                onClick={() => setShowExpulsionWarning(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-mono transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN & 2FA MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#050e1f] border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(0,240,255,0.4)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00f0ff]" />
                <h3 className="font-bold text-white text-sm">
                  Autenticación Segura (Gmail + 2FA)
                </h3>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-cyan-200 mb-1 font-mono">Correo Gmail Verificado:</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="tu_cuenta@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/40 text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-cyan-200 mb-1 font-mono">Código 2FA / OTP (Google Authenticator):</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/40 text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>2FA Activo en Servidores Proyecto 66</span>
                </div>
                <p>Tu cuenta y fichas de juego quedan aseguradas contra accesos no autorizados.</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  playCyberSound('approve');
                  setIsLoggedIn(true);
                  setTwoFactorActive(true);
                  setIsLoginModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold text-xs font-mono transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                Verificar e Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-mono transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESPORTS LEADERBOARD MODAL */}
      <EsportsLeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
    </div>
  );
};
