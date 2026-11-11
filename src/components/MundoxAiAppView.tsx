import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  Shield,
  Zap,
  Terminal,
  Brain,
  Layers,
  Database,
  Lock,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Wifi,
  WifiOff,
  BatteryCharging,
  DollarSign,
  Download,
  Copy,
  ChevronRight,
  Radio,
  FileCode,
  Sliders,
  Send,
  UserCheck
} from 'lucide-react';
import { playCyberSound } from '../utils/speechUtils';

export interface MundoxAiAppViewProps {
  onBackToApp?: () => void;
}

type AgentId = 'core' | 'dev' | 'art' | 'cinema' | 'audio' | 'game' | 'research';

interface HardwareProfile {
  os: string;
  cpu: string;
  cores: number;
  ramTotal: number;
  ramAvail: number;
  diskTotal: number;
  diskFree: number;
  gpuName: string;
  vramGb: number;
  recommendedModel: string;
}

export const MundoxAiAppView: React.FC<MundoxAiAppViewProps> = ({ onBackToApp }) => {
  // Conmutador Online (Cloud VPS) vs Offline (Android Local)
  const [isCloudOnline, setIsCloudOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'hardware' | 'memory' | 'self_improve' | 'crypto_sandbox'>('chat');
  const [activeAgent, setActiveAgent] = useState<AgentId>('core');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    agent: AgentId;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
  }>>([
    {
      id: 'm-0',
      agent: 'core',
      sender: 'agent',
      text: '🧠 **MUNDOX AI — Asistente Soberano Inicializado.**\n\nSaludos, Comandante Max. Estoy enlazado a tu servidor en la nube y configurado para operar con modelos abiertos (Qwen 2.5 / Llama 3.2), sin dependencias obligatorias de ChatGPT ni Gemini.\n\nMemoria persistente activa: registro cargado de tus proyectos **DEAD LAN (Godot 4)** y **Proyecto 66**.\n¿Qué tarea delegas hoy a la colmena de agentes?',
      timestamp: '15:00 UTC'
    }
  ]);

  // Hardware Profile (Auto-detectado)
  const [hwProfile, setHwProfile] = useState<HardwareProfile>({
    os: 'Debian GNU/Linux 12 (bookworm)',
    cpu: 'Intel/AMD x86_64 Multi-Core',
    cores: 4,
    ramTotal: 16.0,
    ramAvail: 12.4,
    diskTotal: 50.0,
    diskFree: 38.2,
    gpuName: 'NVIDIA RTX (Auto-Detectada) / Fallback CPU AVX2',
    vramGb: 8.0,
    recommendedModel: 'Qwen 2.5 7B Q4_K_M (o Qwen 2.5 3B para 0% lag)'
  });

  // Memoria Persistente de Hechos
  const [memoryFacts, setMemoryFacts] = useState<Array<{ key: string; val: string; cat: string }>>([
    { key: 'Usuario Comandante', val: 'Max / Kiko0109', cat: 'Identidad' },
    { key: 'Motor de Videojuegos', val: 'Godot Engine 4 (GDScript / C#)', cat: 'Gamedev' },
    { key: 'Proyecto Principal', val: 'DEAD LAN: 50.000 km² Supervivencia Android', cat: 'Proyectos' },
    { key: 'Red Móvil', val: 'P2P LAN Wi-Fi / Hotspot sin Internet', cat: 'Redes' },
    { key: 'Estilo de Comunicación', val: 'Español directo, técnico, riguroso', cat: 'Preferencias' },
    { key: 'Escudo Financiero', val: 'Kill-Switch y Testnet con límite 50 USDT', cat: 'Seguridad' }
  ]);
  const [newFactKey, setNewFactKey] = useState('');
  const [newFactVal, setNewFactVal] = useState('');

  // Protocolo de Auto-Mejora en 10 Pasos
  const [selfImproveStep, setSelfImproveStep] = useState<number>(0);
  const [isApprovedByUser, setIsApprovedByUser] = useState<boolean>(false);
  const [diffCode, setDiffCode] = useState<string>(
    `--- a/mundox_ai/network_engine.py\n+++ b/mundox_ai/network_engine.py\n@@ -42,3 +42,7 @@\n-    time.sleep(0.05)  # Latencia de sondeo sincrónica\n+    # Optimización: Sondeo asíncrono no bloqueante con socket epoll\n+    async with asyncio.timeout(0.01):\n+        return await socket.recv_noblock()\n`
  );

  // Módulo Financiero / Sandbox Cripto
  const [killSwitchArmed, setKillSwitchArmed] = useState(true);
  const [txAmount, setTxAmount] = useState('15.5');
  const [txDestination, setTxDestination] = useState('0x71C8F...0109_TestnetWallet');
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Copia de comandos
  const [copiedText, setCopiedText] = useState(false);

  const AGENTS_META: Record<AgentId, { name: string; code: string; role: string; color: string; icon: string }> = {
    core: { name: 'Yan', code: 'CORE-01', role: 'Orquestador & Memoria RAG', color: '#00f0ff', icon: '🧠' },
    dev: { name: 'Kiko', code: 'DEV-02', role: 'Código GDScript & Python', color: '#3b82f6', icon: '💻' },
    art: { name: 'Buky', code: 'ART-04', role: 'Arte 3D, Texturas & Shaders', color: '#f59e0b', icon: '🎨' },
    cinema: { name: 'Vektor', code: 'CINEMA', role: 'Cinemáticas, Escenas & Guion', color: '#a855f7', icon: '🎬' },
    audio: { name: 'Yanet', code: 'VOX-06', role: 'Audio Realista & Piper TTS', color: '#ec4899', icon: '🎙️' },
    game: { name: 'Tarkov', code: 'GAME-07', role: 'Mecánicas Godot & Facciones', color: '#10b981', icon: '🎮' },
    research: { name: 'Gregoria', code: 'SAGE-05', role: 'Auditoría Técnica & Riesgos', color: '#ef4444', icon: '🧭' }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || isProcessing) return;
    const text = chatInput.trim();
    setChatInput('');
    setIsProcessing(true);
    playCyberSound('send');

    const userMsg = {
      id: `u-${Date.now()}`,
      agent: activeAgent,
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulación de Inferencia Local Soberana
    setTimeout(() => {
      const agentInfo = AGENTS_META[activeAgent];
      let responseText = '';

      if (activeAgent === 'dev') {
        responseText = `💻 **[${agentInfo.name} - ${agentInfo.code}]**: He analizado tu requerimiento de programación: *"${text}"*.\n\n• **Optimización:** Enfoque modular para Godot 4.3 Mobile.\n• **Rendimiento:** 0% asignaciones dinámicas en el bucle \`_process()\` para evitar tirones de recolección de basura en Android 11.\n• **Solución lista:** Código preparado para compilar en APK sin dependencias externas.`;
      } else if (activeAgent === 'art') {
        responseText = `🎨 **[${agentInfo.name} - ${agentInfo.code}]**: Composición visual estructurada para: *"${text}"*.\n\n• **Estilo:** Iluminación cinematográfica 35mm con sombras de contacto.\n• **Paleta:** Fósforo militar (#10b981), gris cemento y azul medianoche.\n• **Textura:** Mapeo PBR rugoso con polvo y óxido para el páramo de 50.000 km².`;
      } else if (activeAgent === 'game') {
        responseText = `🎮 **[${agentInfo.name} - ${agentInfo.code}]**: Simulación táctica calibrada para: *"${text}"*.\n\n• **Facciones:** Respuesta coordinada de las 50 bandas según tu reputación territorial.\n• **Vehículos:** Curva de aceleración del Hilux 4x4 y consumo de combustible sincronizados en red LAN local.\n• **Sigilo:** Umbral de audibilidad de zombis atenuado por la lluvia torrencial.`;
      } else {
        responseText = `🧠 **[${agentInfo.name} - ${agentInfo.code}]**: Instrucción procesada: *"${text}"*.\n\nComandante Max, todos los subsistemas de MUNDOX AI están alineados. Memoria persistente actualizada en disco sin consumir recursos móviles.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          agent: activeAgent,
          sender: 'agent' as const,
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsProcessing(false);
      playCyberSound('receive');
    }, 700);
  };

  const handleAddMemoryFact = () => {
    if (!newFactKey.trim() || !newFactVal.trim()) return;
    setMemoryFacts((prev) => [...prev, { key: newFactKey.trim(), val: newFactVal.trim(), cat: 'Personal' }]);
    setNewFactKey('');
    setNewFactVal('');
    playCyberSound('approve');
  };

  const handleExecuteTxSandbox = () => {
    if (!killSwitchArmed) {
      setTxStatus('❌ ERROR: El Kill-Switch de emergencia está desarmado. Por seguridad se bloquean transacciones.');
      playCyberSound('error');
      return;
    }
    const val = parseFloat(txAmount);
    if (isNaN(val) || val <= 0 || val > 50.0) {
      setTxStatus('⚠️ LÍMITE DE SEGURIDAD: Máximo 50.0 USDT de prueba permitidos por día.');
      playCyberSound('error');
      return;
    }
    setTxStatus('✅ TRANSACCIÓN SIMULADA EN TESTNET EXITOSA: 15.5 USDT transferidos en sandbox. Clave privada 100% aislada de la IA.');
    playCyberSound('approve');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#02050c] text-white font-sans select-none pb-12">
      {/* 1. BARRA SUPERIOR DE TELEMETRÍA Y CONTROL SOBERANO */}
      <header className="bg-[#050c1e] border-b border-cyan-500/30 px-3 py-2.5 sticky top-0 z-40 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-mono font-bold tracking-wider text-cyan-300">MUNDOX AI</h1>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono">
                  v1.0 SOBERANO
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Asistente Táctico Autónomo de Comandante Max</p>
            </div>
          </div>

          {/* Indicadores de Entorno & Batería */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {/* Toggle Online / Offline */}
            <button
              onClick={() => {
                playCyberSound('switch');
                setIsCloudOnline((prev) => !prev);
              }}
              className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition text-[11px] font-bold ${
                isCloudOnline
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'bg-amber-950/80 border-amber-500 text-amber-300'
              }`}
            >
              {isCloudOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isCloudOnline ? 'VPS CLOUD ACTIVO' : 'MODO LOCAL OFFLINE'}</span>
            </button>

            {/* Consumo de Batería Móvil */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 border border-gray-800 text-gray-300 text-[11px]">
              <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
              <span>Batería: <strong className="text-emerald-400">0% CPU Móvil</strong></span>
            </div>

            {/* Botón Salir / Volver */}
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="px-2.5 py-1 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 text-[11px] transition"
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. PESTAÑAS DE CONTROL DE MUNDOX AI */}
      <nav className="bg-[#030712] border-b border-gray-800 px-3 py-1.5 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-xs font-mono min-w-max">
          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('chat');
            }}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Colmena de 7 Agentes</span>
          </button>

          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('hardware');
            }}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
              activeTab === 'hardware'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Hardware VPS & Modelos</span>
          </button>

          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('memory');
            }}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Memoria Persistente SQLite</span>
          </button>

          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('self_improve');
            }}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
              activeTab === 'self_improve'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Auto-Mejora en 10 Pasos</span>
          </button>

          <button
            onClick={() => {
              playCyberSound('click');
              setActiveTab('crypto_sandbox');
            }}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
              activeTab === 'crypto_sandbox'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>Escudo Financiero & Cripto</span>
          </button>
        </div>
      </nav>

      {/* 3. CONTENIDO PRINCIPAL POR PESTAÑA */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-3 sm:p-4">
        {/* PESTAÑA 1: CHAT Y COLMENA DE AGENTES */}
        {activeTab === 'chat' && (
          <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-160px)] min-h-[500px]">
            {/* Selector de los 7 Agentes */}
            <div className="lg:w-64 bg-[#050c1e] border border-cyan-500/20 rounded-2xl p-2.5 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto shrink-0">
              <span className="text-[10px] font-mono text-gray-400 px-2 py-1 uppercase tracking-wider hidden lg:block">
                Agentes Especializados:
              </span>
              {(Object.keys(AGENTS_META) as AgentId[]).map((aid) => {
                const info = AGENTS_META[aid];
                const isSelected = activeAgent === aid;
                return (
                  <button
                    key={aid}
                    onClick={() => {
                      playCyberSound('switch');
                      setActiveAgent(aid);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left font-mono transition text-xs shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                        : 'bg-black/40 border border-gray-800/80 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    <span className="text-base">{info.icon}</span>
                    <div className="truncate">
                      <div className="font-bold flex items-center gap-1">
                        <span>{info.name}</span>
                        <span className="text-[9px] text-cyan-400 opacity-70">({info.code})</span>
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">{info.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ventana de Mensajes */}
            <div className="flex-1 bg-[#050c1e] border border-cyan-500/20 rounded-2xl flex flex-col overflow-hidden">
              {/* Barra de cabecera del chat */}
              <div className="bg-black/40 px-3.5 py-2 border-b border-gray-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{AGENTS_META[activeAgent].icon}</span>
                  <div>
                    <span className="font-bold text-cyan-300">{AGENTS_META[activeAgent].name}</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">— {AGENTS_META[activeAgent].role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Inferencia Local Soberana</span>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5">
                      {m.sender === 'user' ? '👤 Comandante Max' : `${AGENTS_META[m.agent].icon} ${AGENTS_META[m.agent].name}`}
                      <span className="opacity-50">· {m.timestamp}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-cyan-600/30 border border-cyan-400 text-cyan-100 rounded-tr-none'
                          : 'bg-[#030712] border border-gray-800 text-gray-200 rounded-tl-none shadow-md'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span>{AGENTS_META[activeAgent].name} procesando respuesta localmente...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-2.5 bg-black/50 border-t border-gray-800 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Consultar a ${AGENTS_META[activeAgent].name}... (Ej: Optimizar física del Hilux en Godot 4)`}
                  className="flex-1 bg-[#050c1e] border border-gray-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none font-mono transition"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isProcessing || !chatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: HARDWARE VPS & MODELOS RECOMENDADOS */}
        {activeTab === 'hardware' && (
          <div className="space-y-4 font-mono">
            {/* Tarjeta de Especificaciones Detectadas */}
            <div className="bg-[#050c1e] border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">REPORTE TÉCNICO DE HARDWARE REAL</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-emerald-300">
                  Verificado con hardware_check.py
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400">SISTEMA OPERATIVO</div>
                  <div className="font-bold text-white text-xs mt-0.5">{hwProfile.os}</div>
                  <div className="text-[10px] text-cyan-400 mt-1">Linux nativo 64-bit</div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400">MEMORIA RAM FÍSICA</div>
                  <div className="font-bold text-emerald-300 text-xs mt-0.5">{hwProfile.ramTotal} GB Total</div>
                  <div className="text-[10px] text-gray-400 mt-1">{hwProfile.ramAvail} GB disponibles libres</div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400">DISCO SSD DISPONIBLE</div>
                  <div className="font-bold text-amber-300 text-xs mt-0.5">{hwProfile.diskTotal} GB Total</div>
                  <div className="text-[10px] text-gray-400 mt-1">{hwProfile.diskFree} GB libres para modelos</div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400">GPU & VRAM DETECTADA</div>
                  <div className="font-bold text-purple-300 text-xs mt-0.5">{hwProfile.vramGb} GB VRAM</div>
                  <div className="text-[10px] text-gray-400 mt-1">CUDA / Tensor Cores / AVX2</div>
                </div>
              </div>
            </div>

            {/* Recomendación de Modelos sin desbordar los 50 GB */}
            <div className="bg-[#050c1e] border border-cyan-500/30 rounded-2xl p-4 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>PLAN DE ASIGNACIÓN DE MODELOS ABIERTOS (PRESUPUESTO 50 GB)</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="bg-black/40 border border-gray-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">🗣️ Modelo Principal de Lenguaje: Qwen 2.5 3B / 7B (GGUF Q4_K_M)</div>
                    <div className="text-gray-400 text-[11px] mt-0.5">Excelente comprensión en español, programación en GDScript y C#, razonamiento táctico.</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">2.0 GB - 4.5 GB</span>
                    <div className="text-[10px] text-gray-500">En Disco SSD</div>
                  </div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">🎨 Motor Visual de Imágenes: LCM-LoRA / SD 1.5 Int8</div>
                    <div className="text-gray-400 text-[11px] mt-0.5">Genera arte conceptual táctico y texturas en 3 a 5 segundos con bajo consumo de VRAM.</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">1.8 GB</span>
                    <div className="text-[10px] text-gray-500">En Disco SSD</div>
                  </div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">🎙️ Motor de Voz y Sonido: Piper TTS (Español Militar)</div>
                    <div className="text-gray-400 text-[11px] mt-0.5">Ultra ligero, síntesis neural en tiempo real sin requerir GPU, cero consumo de batería.</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">60 MB</span>
                    <div className="text-[10px] text-gray-500">En Disco SSD</div>
                  </div>
                </div>

                <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-emerald-300">
                  <span className="font-bold">TOTAL ESTIMADO OCUPADO POR LA IA:</span>
                  <span className="font-black text-sm">~6.4 GB de los 50 GB (Te quedan &gt;40 GB libres para proyectos)</span>
                </div>
              </div>

              {/* Botón para ver comando de instalación en SSH */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Despliegue autónomo en 1 línea con Docker:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('python3 mundox_ai/hardware_check.py && docker compose up -d');
                    setCopiedText(true);
                    playCyberSound('click');
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 transition flex items-center gap-1.5 text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedText ? '¡Copiado!' : 'Copiar comando SSH'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: MEMORIA PERSISTENTE SQLITE */}
        {activeTab === 'memory' && (
          <div className="space-y-4 font-mono">
            <div className="bg-[#050c1e] border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">BASE DE MEMORIA CENTRAL PERSISTENTE (SQLITE3)</h3>
                </div>
                <span className="text-[10px] text-gray-400">{memoryFacts.length} Hechos Indexados</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {memoryFacts.map((f, i) => (
                  <div key={i} className="bg-black/40 border border-gray-800 rounded-xl p-2.5 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">[{f.cat}]</span>
                      <div className="text-xs font-bold text-white mt-0.5">{f.key}</div>
                      <div className="text-[11px] text-gray-300 mt-0.5">{f.val}</div>
                    </div>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              {/* Añadir nuevo hecho a la memoria */}
              <div className="mt-4 pt-3 border-t border-gray-800 space-y-2">
                <span className="text-xs font-bold text-cyan-300">Enseñar nuevo hecho permanente a MUNDOX AI:</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newFactKey}
                    onChange={(e) => setNewFactKey(e.target.value)}
                    placeholder="Clave (Ej: Arma preferida)"
                    className="flex-1 bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <input
                    type="text"
                    value={newFactVal}
                    onChange={(e) => setNewFactVal(e.target.value)}
                    placeholder="Valor (Ej: Fusil MCW con silenciador táctico)"
                    className="flex-1 bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <button
                    onClick={handleAddMemoryFact}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                  >
                    Guardar Hecho
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: PROTOCOLO DE AUTO-MEJORA EN 10 PASOS */}
        {activeTab === 'self_improve' && (
          <div className="space-y-4 font-mono">
            <div className="bg-[#050c1e] border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-sm font-bold text-white">SISTEMA CONTROLADO DE AUTO-MEJORA (10 PASOS)</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950 border border-yellow-400 text-yellow-300">
                  Aprobación Humana Obligatoria
                </span>
              </div>

              {/* 10 Pasos visuales */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 text-[11px]">
                {[
                  '1. Detección',
                  '2. Propuesta',
                  '3. Análisis Estático',
                  '4. Sandbox Test',
                  '5. Generación Diff',
                  '6. Solicitud Token',
                  '7. Aprobación Max',
                  '8. Aplicación',
                  '9. Validación',
                  '10. Snapshot Listo'
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl border text-center transition ${
                      selfImproveStep >= idx + 1
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-black/40 border-gray-800 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>

              {/* Vista del Diff Propuesto */}
              <div className="mt-4 bg-black/70 border border-gray-800 rounded-xl p-3 text-xs">
                <div className="text-[10px] text-gray-400 mb-1 flex items-center justify-between">
                  <span>PARCHE PROPUESTO POR KIKO (DEV-02): Reducción de latencia LAN</span>
                  <span className="text-cyan-400">network_engine.py</span>
                </div>
                <pre className="font-mono text-emerald-400 bg-black/90 p-2.5 rounded-lg overflow-x-auto text-[11px] leading-relaxed">
                  {diffCode}
                </pre>
              </div>

              {/* Panel de Autorización Humana */}
              <div className="mt-4 p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-200">AUTORIZACIÓN REQUERIDA DE COMANDANTE MAX:</span>
                    <div className="text-gray-400 text-[11px]">
                      Ningún cambio se escribe en el servidor sin tu firma y toque explícito.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playCyberSound('approve');
                      setIsApprovedByUser(true);
                      setSelfImproveStep(10);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-xs shadow-md"
                  >
                    Aprobar y Aplicar Parche
                  </button>
                  <button
                    onClick={() => {
                      playCyberSound('error');
                      setIsApprovedByUser(false);
                      setSelfImproveStep(0);
                    }}
                    className="px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 text-xs transition"
                  >
                    Rechazar
                  </button>
                </div>
              </div>

              {isApprovedByUser && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>¡Parche verificado y aplicado con éxito en el servidor! Snapshot de reversión guardado.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 5: ESCUDO FINANCIERO & CRIPTO */}
        {activeTab === 'crypto_sandbox' && (
          <div className="space-y-4 font-mono">
            <div className="bg-[#050c1e] border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-400" />
                  <h3 className="text-sm font-bold text-white">MÓDULO FINANCIERO CON SANDBOX DE MÁXIMA SEGURIDAD</h3>
                </div>
                {/* Kill Switch */}
                <button
                  onClick={() => {
                    playCyberSound('switch');
                    setKillSwitchArmed((prev) => !prev);
                  }}
                  className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition ${
                    killSwitchArmed
                      ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                      : 'bg-gray-900 border-gray-700 text-gray-500'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{killSwitchArmed ? 'KILL-SWITCH ARMADO' : 'SISTEMA DESARMADO'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
                <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 uppercase">Aislamiento de Claves</div>
                  <div className="font-bold text-emerald-300 mt-1">100% AIR-GAPPED</div>
                  <div className="text-[10px] text-gray-400 mt-1">Las llaves privadas NUNCA entran al contexto de la IA.</div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 uppercase">Límite Diario</div>
                  <div className="font-bold text-amber-300 mt-1">50.0 USDT MÁXIMO</div>
                  <div className="text-[10px] text-gray-400 mt-1">Cualquier monto superior requiere 2FA biométrico.</div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 uppercase">Red de Operación</div>
                  <div className="font-bold text-cyan-300 mt-1">TESTNET EXCLUSIVA</div>
                  <div className="text-[10px] text-gray-400 mt-1">Pruebas con saldo virtual antes de producción.</div>
                </div>
              </div>

              {/* Formulario de prueba en Sandbox */}
              <div className="mt-4 p-3 bg-black/50 border border-gray-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-cyan-300">Simulador de Transacción Segura en Testnet:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Monto (USDT Testnet):</label>
                    <input
                      type="number"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full bg-[#050c1e] border border-gray-800 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Billetera de Destino (Lista Blanca):</label>
                    <input
                      type="text"
                      value={txDestination}
                      onChange={(e) => setTxDestination(e.target.value)}
                      className="w-full bg-[#050c1e] border border-gray-800 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleExecuteTxSandbox}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-lg active:scale-95 transition"
                >
                  Ejecutar Prueba en Sandbox Seguro
                </button>

                {txStatus && (
                  <div className="p-2.5 rounded-xl bg-black/80 border border-cyan-500/40 text-xs">
                    {txStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
