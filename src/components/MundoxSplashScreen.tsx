import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Shield, Zap, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { playCyberSound } from '../utils/speechUtils';

interface MundoxSplashScreenProps {
  onComplete: () => void;
  autoCloseDelayMs?: number;
}

export const MundoxSplashScreen: React.FC<MundoxSplashScreenProps> = ({
  onComplete,
  autoCloseDelayMs = 3500
}) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Iniciando MUNDOX Telegram Games Hub...');
  const [isReady, setIsReady] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let isPausedAt85 = false;

    // Realistic cinematic loading simulation (total ~6.5s so the artwork and bar are fully enjoyed)
    const runStep = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsReady(true);
          return 100;
        }

        // Pause deliberately at 85% to match the screenshot artwork
        if (prev >= 84 && prev < 86 && !isPausedAt85) {
          isPausedAt85 = true;
          setStatusMessage('¡85% ALCANZADO: CARGANDO TU EXPERIENCIA ÉPICA...');
          timer = setTimeout(() => {
            setProgress(86);
            runStep();
          }, 1400);
          return 85;
        }

        const next = prev + (prev < 30 ? 2 : prev < 70 ? 1 : prev < 85 ? 1 : prev < 95 ? 1 : 2);
        const clamped = Math.min(100, next);

        if (clamped < 25) {
          setStatusMessage('Iniciando protocolos de seguridad y Bóveda de Max (10% Rake)...');
        } else if (clamped < 55) {
          setStatusMessage('Sincronizando El Silo Cubano (Alante y Atrás) & Dominó Doble 9...');
        } else if (clamped < 85) {
          setStatusMessage('Inicializando Aventuras Épicas, Juego de Comando y Top 10 Esports...');
        } else if (clamped < 100) {
          setStatusMessage('CARGANDO TU EXPERIENCIA ÉPICA...');
        } else {
          setStatusMessage('¡MUNDOX GAMES HUB COMPLETADO AL 100%!');
        }

        const delay = clamped < 40 ? 75 : clamped < 85 ? 95 : 110;
        timer = setTimeout(runStep, delay);
        return clamped;
      });
    };

    timer = setTimeout(runStep, 150);

    return () => clearTimeout(timer);
  }, []);

  // Auto transition when progress reaches 100% (holds for 2.0s so user can admire)
  useEffect(() => {
    if (progress === 100) {
      if (!soundMuted) playCyberSound('approve');
      const timeout = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete, soundMuted]);

  const handleEnterNow = () => {
    if (!soundMuted) playCyberSound('switch');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black text-white select-none overflow-hidden font-sans">
      {/* Background Graphic Asset: MUNDOX_portada_89727de9.png */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/aistudio/MUNDOX_portada_89727de9.png"
          alt="MUNDOX Telegram Games Hub Portada"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        {/* Subtle cinematic gradient vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80 pointer-events-none" />
      </div>

      {/* Top Floating Control Bar */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>PROYECTO 66 • PORTAL OFICIAL</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/30 text-gray-300 hover:text-white transition"
            title="Alternar sonido"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={handleEnterNow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-xs font-bold font-mono text-cyan-200 transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <span>Omitir Portada</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Spacer to showcase the spectacular illustration */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {/* Glowing Title Aura */}
        <div className="text-center">
          <h1 className="sr-only">MUNDOX TELEGRAM GAMES HUB</h1>
        </div>
      </div>

      {/* Bottom Loading Progress Container matching the original image design */}
      <div className="relative z-10 w-full max-w-2xl px-4 sm:px-6 pb-8 sm:pb-12 flex flex-col items-center">
        {/* Percentage Number Badge with Neon Glow */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,240,255,1)]">
            {progress}%
          </span>
        </div>

        {/* Outer Loading Track */}
        <div className="w-full h-6 sm:h-7 rounded-full bg-black/80 backdrop-blur-md border-2 border-cyan-400 p-0.5 shadow-[0_0_30px_rgba(0,240,255,0.6)] relative overflow-hidden">
          {/* Animated Glowing Fill Bar */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-cyan-400 transition-all duration-150 ease-out relative shadow-[0_0_20px_#00f0ff]"
            style={{ width: `${progress}%` }}
          >
            {/* Gloss reflection highlight line */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-white/35 rounded-t-full pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white animate-pulse" />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="mt-3 text-center">
          <p className="text-xs sm:text-sm font-black font-mono tracking-widest uppercase text-cyan-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-pulse">
            {statusMessage}
          </p>
          <p className="text-[10px] text-gray-400 font-mono mt-1">
            Plataforma Soberana de Juegos • Silo Cubano • MMORPG • Comando COD
          </p>
        </div>

        {/* Enter Button when ready or active */}
        {isReady && (
          <div className="mt-4 animate-bounce">
            <button
              onClick={handleEnterNow}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-cyan-500 hover:from-red-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(0,240,255,0.8)] flex items-center gap-2 transition transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ENTRAR A MUNDOX GAMES HUB</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
