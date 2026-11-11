import React from 'react';
import {
  Settings,
  Download,
  Smartphone,
  Info,
  Send,
  ShieldCheck,
  Brain,
  OctagonX,
  Play,
  TrendingUp,
  Cloud,
  Trophy,
  Coins,
  Volume2
} from 'lucide-react';
import { TelegramConfig } from '../types';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenApkGuide: () => void;
  onOpenBotsOverview: () => void;
  onOpenTelegram: () => void;
  onOpenAuditLog?: () => void;
  onOpenSovereignAi?: () => void;
  onOpenCloudNetwork?: () => void;
  onOpenSportsBetting?: () => void;
  onOpenCryptoWallet?: () => void;
  onToggleEmergencyStop?: () => void;
  isAutomationStopped?: boolean;
  onInstallPwa: () => void;
  canInstallPwa: boolean;
  neonIntensity: 'high' | 'medium' | 'subtle';
  telegramStatus?: TelegramConfig['status'];
  isContinuousVoiceActive?: boolean;
  onToggleContinuousVoice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenApkGuide,
  onOpenBotsOverview,
  onOpenTelegram,
  onOpenAuditLog,
  onOpenSovereignAi,
  onOpenCloudNetwork,
  onOpenSportsBetting,
  onOpenCryptoWallet,
  onToggleEmergencyStop,
  isAutomationStopped = false,
  onInstallPwa,
  canInstallPwa,
  neonIntensity,
  telegramStatus = 'disconnected',
  isContinuousVoiceActive = false,
  onToggleContinuousVoice
}) => {

  const glowClass =
    neonIntensity === 'high'
      ? 'neon-glow-text text-[#00f0ff]'
      : neonIntensity === 'medium'
      ? 'text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
      : 'text-[#38bdf8]';

  return (
    <header className="sticky top-0 z-30 bg-[#030712]/95 backdrop-blur-md border-b border-[#00f0ff]/20 px-3 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#050c1e] border border-[#00f0ff]/50 shadow-[0_0_12px_rgba(0,240,255,0.3)] shrink-0">
            <span className="font-mono font-black text-sm text-[#00f0ff] tracking-tight">66</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00f0ff]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className={`font-black text-base md:text-lg tracking-wider uppercase font-mono truncate ${glowClass}`}>
                Proyecto 66
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                v1.1 ANDROID
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                <span className="font-mono text-[#00f0ff]/90 text-[10px]">EN LÍNEA</span>
              </span>
              <span className="hidden xs:inline text-gray-600">•</span>
              <span className="hidden xs:inline truncate text-gray-400 text-[10px]">Yan + 6 Bots Tácticos</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Hands-Free Voice Continuous Mode Button */}
          {onToggleContinuousVoice && (
            <button
              onClick={onToggleContinuousVoice}
              title={
                isContinuousVoiceActive
                  ? 'Modo Conversación por Voz Manos Libres ACTIVO'
                  : 'Activar Modo Conversación por Voz Manos Libres'
              }
              className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 active:scale-95 ${
                isContinuousVoiceActive
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse'
                  : 'bg-[#050c1e] hover:bg-[#00f0ff]/10 text-gray-300 hover:text-[#00f0ff] border border-[#00f0ff]/30'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isContinuousVoiceActive ? 'text-emerald-400' : 'text-[#00f0ff]'}`} />
              <span className="hidden sm:inline">Voz Alta</span>
            </button>
          )}

          {/* Bots overview button */}
          <button
            onClick={onOpenBotsOverview}
            title="Ver funciones de los 7 bots"
            className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg bg-[#050c1e] hover:bg-[#00f0ff]/10 text-gray-300 hover:text-[#00f0ff] border border-[#00f0ff]/30 text-xs font-mono transition-all duration-200"
          >
            <Info className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="hidden md:inline font-semibold">Bots</span>
          </button>



          {/* Sports Betting & External APKs Auditor Button */}
          {onOpenSportsBetting && (
            <button
              onClick={onOpenSportsBetting}
              title="Motor de Apuestas Deportivas y Auditor de APKs (Primero Aprende, Luego Apuesta)"
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-[#050c1e] hover:bg-amber-950/30 text-amber-400 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] text-xs font-mono font-bold transition-all duration-200 active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Apuestas</span>
            </button>
          )}

          {/* Sovereign AI & RAG Button (Section 11) */}
          {onOpenSovereignAi && (
            <button
              onClick={onOpenSovereignAi}
              title="Centro de IA Soberana, RAG y Modelos Locales (Sección 11)"
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-[#050c1e] hover:bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] text-xs font-mono font-bold transition-all duration-200 active:scale-95"
            >
              <Brain className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="hidden lg:inline">IA Soberana</span>
            </button>
          )}

          {/* Cloud Network 24/7 Button */}
          {onOpenCloudNetwork && (
            <button
              onClick={onOpenCloudNetwork}
              title="Red de Nubes 24/7 y Orquestador Autónomo (0% Móvil)"
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-[#050c1e] hover:bg-sky-950/40 text-sky-400 border border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.2)] text-xs font-mono font-bold transition-all duration-200 active:scale-95"
            >
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline">Red Nubes</span>
            </button>
          )}

          {/* Crypto Wallet BEP-20 Button */}
          {onOpenCryptoWallet && (
            <button
              onClick={onOpenCryptoWallet}
              title="Billetera Cripto Soberana (Token P66 / USDT BEP-20)"
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-[#050c1e] hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)] text-xs font-mono font-bold transition-all duration-200 active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Billetera P66</span>
            </button>
          )}

          {/* Telegram Connection Button */}
          <button
            onClick={onOpenTelegram}
            title={
              telegramStatus === 'connected'
                ? 'Telegram conectado y sincronizado'
                : 'Configurar conexión segura con Telegram'
            }
            className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg text-xs font-mono transition-all duration-200 active:scale-95 ${
              telegramStatus === 'connected'
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)] font-bold'
                : 'bg-[#050c1e] hover:bg-[#00f0ff]/10 text-gray-300 hover:text-[#00f0ff] border border-[#00f0ff]/30'
            }`}
          >
            <span className="relative flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-[#00f0ff]" />
              {telegramStatus === 'connected' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </span>
            <span className="hidden sm:inline">Telegram</span>
          </button>

          {/* Emergency Stop Button for Automated Tasks (Section 3) */}
          {onToggleEmergencyStop && (
            <button
              onClick={onToggleEmergencyStop}
              title={
                isAutomationStopped
                  ? 'Reanudar tareas automatizadas'
                  : 'Detener inmediatamente todas las tareas automáticas de los bots'
              }
              className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 active:scale-95 ${
                isAutomationStopped
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'bg-[#050c1e] hover:bg-rose-950/30 text-gray-300 hover:text-rose-400 border border-gray-700 hover:border-rose-500/50'
              }`}
            >
              {isAutomationStopped ? (
                <>
                  <Play className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden md:inline">Reanudar</span>
                </>
              ) : (
                <>
                  <OctagonX className="w-3.5 h-3.5 text-gray-400 group-hover:text-rose-400" />
                  <span className="hidden md:inline">Detener</span>
                </>
              )}
            </button>
          )}

          {/* Audit Log (Gregoria) */}
          {onOpenAuditLog && (
            <button
              onClick={onOpenAuditLog}
              title="Registro de Auditoría de Gregoria (SEC-05)"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#050c1e] hover:bg-[#00f0ff]/10 text-gray-300 hover:text-[#00f0ff] border border-[#00f0ff]/30 text-xs font-mono transition-all duration-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="hidden lg:inline">Auditoría</span>
            </button>
          )}

          {/* Export / APK guide */}
          <button
            onClick={onOpenApkGuide}
            title="Guía y Exportación a GitHub, Render y APK Android"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00f0ff]/20 to-[#0088cc]/20 hover:from-[#00f0ff]/30 hover:to-[#0088cc]/30 text-[#00f0ff] border border-[#00f0ff]/60 shadow-[0_0_10px_rgba(0,240,255,0.25)] text-xs font-mono font-semibold transition-all duration-200 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="inline font-bold">APK / Nube</span>
          </button>

          {/* Botón Instalar directo en Android */}
          <button
            onClick={onInstallPwa}
            title="Instalar Proyecto 66 directamente en tu móvil Android"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-mono font-black text-xs shadow-[0_0_14px_rgba(0,240,255,0.6)] transition-all duration-200 active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="inline">Instalar</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="Configuración de Proyecto 66"
            className="p-1.5 sm:p-2 rounded-lg bg-[#050c1e] hover:bg-[#00f0ff]/10 text-gray-300 hover:text-[#00f0ff] border border-[#00f0ff]/30 transition-all duration-200 active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
