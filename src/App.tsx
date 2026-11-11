import React, { useState, useEffect, useRef } from 'react';
import {
  BotId,
  BotInfo,
  ChatMessage,
  AppSettings,
  TelegramConfig,
  AppMode,
  ProposedTask,
  AuditLogEntry,
  KnowledgeEntry,
  SovereignAiConfig
} from './types';
import { BOTS_DATA, BOTS_LIST } from './data/bots';
import { Header } from './components/Header';
import { AppModeSwitcher } from './components/AppModeSwitcher';
import { BotSelectorBar } from './components/BotSelectorBar';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { ChatInput } from './components/ChatInput';
import { TaskApprovalCard } from './components/TaskApprovalCard';
import { AuditLogModal } from './components/AuditLogModal';
import { SovereignAiModal } from './components/SovereignAiModal';
import { CloudNetworkModal } from './components/CloudNetworkModal';
import { SportsBettingModal } from './components/SportsBettingModal';
import { CryptoWalletModal } from './components/CryptoWalletModal';
import { MarketAnalysisPanel } from './components/MarketAnalysisPanel';
import { StudyAppView } from './components/StudyAppView';
import { GamesAppView } from './components/GamesAppView';
import { TelegramGamesHubView } from './components/TelegramGamesHubView';
import { DeadLanAppView } from './components/DeadLanAppView';
import { MundoxAiAppView } from './components/MundoxAiAppView';
import { MundoxSplashScreen } from './components/MundoxSplashScreen';
import { BotDossierModal } from './components/BotDossierModal';
import { BotsOverviewModal } from './components/BotsOverviewModal';
import { SettingsModal } from './components/SettingsModal';
import { ApkExportModal } from './components/ApkExportModal';
import { MicrophoneDiagnosticModal } from './components/MicrophoneDiagnosticModal';
import { TelegramModal } from './components/TelegramModal';
import { AndroidShell } from './components/AndroidShell';
import { BotIcon } from './components/BotIcon';
import { generateBotResponse, generateGroupResponses } from './utils/botEngine';
import { playCyberSound, speakText, stopSpeaking } from './utils/speechUtils';
import {
  loadKnowledgeBase,
  saveKnowledgeBase,
  loadSovereignAiConfig,
  saveSovereignAiConfig,
  saveLearningMemoryEntry
} from './utils/knowledgeBase';
import {
  loadTelegramConfig,
  saveTelegramConfig,
  sendTelegramMessage,
  formatBotMessageForTelegram
} from './utils/telegramService';

const DEFAULT_SETTINGS: AppSettings = {
  soundEffects: true,
  ttsEnabled: true,
  ttsVoiceName: '',
  ttsRate: 1.0,
  ttsPitch: 1.0,
  neonIntensity: 'high',
  fontSize: 'normal',
  androidDeviceFrame: true,
  hapticFeedback: true,
  currentApp: 'control',
  continuousVoiceMode: false,
  proactiveAiMode: true
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-yan',
    sender: 'bot',
    botId: 'yan',
    text: `⚡ **¡Bienvenido a Proyecto 66!**\n\nSoy **Yan**, tu asistente principal y núcleo estratégico. Esta aplicación ha sido diseñada y optimizada para teléfonos **Android** con arquitectura futurista en fondo negro y detalles en azul neón.\n\nTienes a tu disposición **7 botones** con nuestras inteligencias tácticas:\n• **Yan**: Asistente Principal y análisis estratégico.\n• **Kiko**: Programación, ciberseguridad y generación de APK.\n• **Max**: Comandante de productividad y táctica.\n• **Buky**: Creatividad, arte visual y storytelling.\n• **Gregoria**: Sabiduría filosófica, historia y ciencia.\n• **Yanet**: Comunicación asertiva, negociación e idiomas.\n• **Kuko**: Dinámicas de entretenimiento, acertijos y humor.\n\nPuedes pulsar el botón **"APK"** superior en cualquier momento para ver cómo compilar tu propia APK Android de forma 100% gratuita. ¿Por dónde empezamos?`,
    timestamp: Date.now(),
    suggestedActions: [
      '¿Cómo genero la APK de Android?',
      'Dame un resumen de las funciones de los bots',
      '¿Cómo me puedes ayudar hoy?'
    ]
  }
];

export default function App() {
  // Settings with LocalStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('proyecto66_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Active Bot
  const [activeBotId, setActiveBotId] = useState<BotId>('yan');

  // Messages with LocalStorage persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('proyecto66_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MESSAGES;
  });

  // UI Modals state
  const [inspectedBot, setInspectedBot] = useState<BotInfo | null>(null);
  const [isBotsOverviewOpen, setIsBotsOverviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
  const [isMicDiagnosticOpen, setIsMicDiagnosticOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isSovereignAiOpen, setIsSovereignAiOpen] = useState(false);
  const [isMarketPanelOpen, setIsMarketPanelOpen] = useState(false);
  const [isCloudNetworkOpen, setIsCloudNetworkOpen] = useState(false);
  const [isSportsBettingOpen, setIsSportsBettingOpen] = useState(false);
  const [isCryptoWalletOpen, setIsCryptoWalletOpen] = useState(false);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>(() => loadTelegramConfig());
  const [isTyping, setIsTyping] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('proyecto66_is_group_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [groupTypingStatus, setGroupTypingStatus] = useState<string | null>(null);
  const [autoListenCounter, setAutoListenCounter] = useState(0);

  // Sovereign AI & RAG Memory (Prompt Maestro Section 11)
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(() => loadKnowledgeBase());
  const [aiConfig, setAiConfig] = useState<SovereignAiConfig>(() => loadSovereignAiConfig());

  // Emergency Stop for Automated Tasks (Prompt Maestro Section 3)
  const [isAutomationStopped, setIsAutomationStopped] = useState<boolean>(() => {
    try {
      return localStorage.getItem('proyecto66_automation_stopped') === 'true';
    } catch {
      return false;
    }
  });

  // App Navigation (DEAD LAN by default, switchable to Games Hub or Control 66)
  const [currentApp, setCurrentApp] = useState<AppMode>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      if (appParam === 'control') return 'control';
      if (appParam === 'juegos' || appParam === 'games') return 'juegos';
      if (appParam === 'mundox' || appParam === 'ai') return 'mundox';
      if (appParam === 'deadlan' || appParam === 'zombie') return 'deadlan';
    } catch {}
    return 'deadlan';
  });

  // MUNDOX Telegram Games Hub & APK Portada con Barra de Carga
  const [showMundoxSplash, setShowMundoxSplash] = useState<boolean>(true);

  // DEAD LAN Fullscreen Viewport Mode (hides top web headers for native APK immersion)
  const [isDeadLanFullscreen, setIsDeadLanFullscreen] = useState<boolean>(true);

  // Proposed Tasks with Approval Requirement (Rule 3 & 8)
  const [pendingTasks, setPendingTasks] = useState<ProposedTask[]>(() => {
    try {
      const saved = localStorage.getItem('proyecto66_pending_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'task-ci-cd-setup',
        title: 'Automatizar Compilación de las 3 APKs en GitHub Actions',
        description: 'Activar el workflow .github/workflows/build-apks.yml para compilar gratuitamente en la nube las APKs de Control, Estudio y Juegos cada vez que se actualice el código.',
        proposedBy: 'yan',
        assignedTo: 'kiko',
        riskLevel: 'bajo',
        requiresApproval: true,
        status: 'pending',
        timestamp: Date.now() - 120000
      }
    ];
  });

  // Security Audit Log by Gregoria (SEC-05)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('proyecto66_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'log-audit-01',
        timestamp: Date.now() - 300000,
        botId: 'gregoria',
        action: 'Auditoría de Perímetro y Permisos',
        details: 'Validación completada: Permisos de micrófono concedidos sin secretos expuestos en código cliente.',
        status: 'success'
      },
      {
        id: 'log-audit-02',
        timestamp: Date.now() - 150000,
        botId: 'yanet',
        action: 'Inicialización de Base de Conocimientos',
        details: 'Catálogo de documentos de APK Estudio y memoria persistente cargados correctamente.',
        status: 'success'
      }
    ];
  });

  // Save tasks and logs
  useEffect(() => {
    try {
      localStorage.setItem('proyecto66_pending_tasks', JSON.stringify(pendingTasks));
    } catch {}
  }, [pendingTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('proyecto66_audit_logs', JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  // Persist Knowledge Base and AI config
  useEffect(() => {
    saveKnowledgeBase(knowledgeEntries);
  }, [knowledgeEntries]);

  useEffect(() => {
    saveSovereignAiConfig(aiConfig);
  }, [aiConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('proyecto66_automation_stopped', String(isAutomationStopped));
    } catch {}
  }, [isAutomationStopped]);

  const handleToggleEmergencyStop = () => {
    const nextState = !isAutomationStopped;
    setIsAutomationStopped(nextState);

    if (nextState) {
      if (settings.soundEffects) playCyberSound('error');
      const logEntry: AuditLogEntry = {
        id: `stop-${Date.now()}`,
        timestamp: Date.now(),
        botId: 'gregoria',
        action: 'Detención de Emergencia Activada',
        details: 'El usuario activó la parada manual de emergencia. Procesos automáticos de bots congelados.',
        status: 'warning',
        userApproved: true
      };
      setAuditLogs((prev) => [logEntry, ...prev]);

      const stopMsg: ChatMessage = {
        id: `stop-msg-${Date.now()}`,
        sender: 'bot',
        botId: 'gregoria',
        text: '🛑 **Detención de Emergencia Activada**\nSe han suspendido de forma inmediata todas las tareas automatizadas y ejecuciones en segundo plano. El sistema se encuentra en modo manual seguro.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, stopMsg]);
    } else {
      if (settings.soundEffects) playCyberSound('click');
      const logEntry: AuditLogEntry = {
        id: `resume-${Date.now()}`,
        timestamp: Date.now(),
        botId: 'gregoria',
        action: 'Reanudación de Automatizaciones',
        details: 'El usuario reactivó el ciclo de automatización de los bots bajo supervisión táctica.',
        status: 'success',
        userApproved: true
      };
      setAuditLogs((prev) => [logEntry, ...prev]);

      const resumeMsg: ChatMessage = {
        id: `resume-msg-${Date.now()}`,
        sender: 'bot',
        botId: 'yan',
        text: '🟢 **Automatizaciones Reanudadas**\nLos bots reanudan sus ciclos de análisis, monitoreo y propuestas de tareas con aprobación.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, resumeMsg]);
    }
  };

  const handleAddKnowledgeEntry = (newEntry: Omit<KnowledgeEntry, 'id' | 'updatedAt'>) => {
    const entry: KnowledgeEntry = {
      ...newEntry,
      id: `kb-${Date.now()}`,
      updatedAt: Date.now()
    };
    setKnowledgeEntries((prev) => [entry, ...prev]);

    const logEntry: AuditLogEntry = {
      id: `kb-log-${Date.now()}`,
      timestamp: Date.now(),
      botId: 'yanet',
      action: `Memoria RAG Actualizada: ${entry.title}`,
      details: `Documento indexado en la Base de Conocimientos bajo categoría [${entry.category.toUpperCase()}].`,
      status: 'success',
      userApproved: true
    };
    setAuditLogs((prev) => [logEntry, ...prev]);
    if (settings.soundEffects) playCyberSound('send');
  };

  const handleDeleteKnowledgeEntry = (id: string) => {
    setKnowledgeEntries((prev) => prev.filter((e) => e.id !== id));
    if (settings.soundEffects) playCyberSound('click');
  };

  const handleUpdateAiConfig = (config: Partial<SovereignAiConfig>) => {
    setAiConfig((prev) => ({ ...prev, ...config }));
  };

  const handleApproveTask = (taskId: string) => {
    const task = pendingTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (settings.soundEffects) playCyberSound('send');

    setPendingTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'approved' } : t))
    );

    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      botId: 'gregoria',
      action: `Operación Autorizada: ${task.title}`,
      details: `Aprobado por el usuario. Tarea delegada a [${task.assignedTo.toUpperCase()}]. Registro inmutable verificado.`,
      status: 'success',
      userApproved: true
    };
    setAuditLogs((prev) => [logEntry, ...prev]);

    // Send confirmation message to chat from Yan
    const confirmMsg: ChatMessage = {
      id: `task-approved-${Date.now()}`,
      sender: 'bot',
      botId: 'yan',
      text: `✅ **Operación Autorizada por el Usuario**:\n*"${task.title}"*\n\nHe delegado la ejecución inmediata en **${task.assignedTo.toUpperCase()}**. Gregoria ha firmado y registrado el evento en el Audit Log.`,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  const handleRejectTask = (taskId: string) => {
    const task = pendingTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (settings.soundEffects) playCyberSound('error');

    setPendingTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'rejected' } : t))
    );

    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      botId: 'gregoria',
      action: `Operación Cancelada: ${task.title}`,
      details: `Rechazado por el usuario. Operación bloqueada preventivamente.`,
      status: 'rejected',
      userApproved: false
    };
    setAuditLogs((prev) => [logEntry, ...prev]);

    const rejectMsg: ChatMessage = {
      id: `task-rejected-${Date.now()}`,
      sender: 'bot',
      botId: 'yan',
      text: `🛑 **Operación Cancelada**:\nHas rechazado la tarea *"${task.title}"*. Respeto tu decisión; no se realizarán modificaciones ni consumos de recursos.`,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, rejectMsg]);
  };

  // PWA Install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeBot = BOTS_DATA[activeBotId];

  // Save settings on update
  useEffect(() => {
    try {
      localStorage.setItem('proyecto66_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Save messages on update
  useEffect(() => {
    try {
      localStorage.setItem('proyecto66_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle PWA install event for Android
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      setIsApkGuideOpen(true);
      return;
    }
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setCanInstallPwa(false);
        setDeferredPrompt(null);
      }
    } catch {
      setIsApkGuideOpen(true);
    }
  };

  // Bot selector action
  const handleSelectBot = (botId: BotId, autoAnnounce = true) => {
    setIsGroupMode(false);
    try {
      localStorage.setItem('proyecto66_is_group_mode', 'false');
    } catch {}

    if (botId === activeBotId && !isGroupMode) return;

    if (settings.soundEffects) {
      playCyberSound('switch');
    }

    setActiveBotId(botId);
    const newBot = BOTS_DATA[botId];

    if (autoAnnounce) {
      const announceMsg: ChatMessage = {
        id: `switch-${Date.now()}`,
        sender: 'bot',
        botId,
        text: `⚡ **Enlace transferido a ${newBot.name} (${newBot.code})**\n*${newBot.title}*\n\n"${newBot.greeting}"`,
        timestamp: Date.now(),
        suggestedActions: newBot.samplePrompts.slice(0, 3)
      };
      setMessages((prev) => [...prev, announceMsg]);

      if (settings.ttsEnabled) {
        speakText(newBot.greeting, newBot, {
          voiceName: settings.ttsVoiceName,
          rate: settings.ttsRate,
          pitch: settings.ttsPitch
        });
      }
    }
  };

  // Toggle Group Mode ("Un grupo para hablar con todos los bots")
  const handleToggleGroupMode = () => {
    const next = !isGroupMode;
    setIsGroupMode(next);
    try {
      localStorage.setItem('proyecto66_is_group_mode', String(next));
    } catch {}

    if (settings.soundEffects) {
      playCyberSound('switch');
    }

    if (next) {
      const groupAnnounce: ChatMessage = {
        id: `group-announce-${Date.now()}`,
        sender: 'bot',
        botId: 'yan',
        isGroupMessage: true,
        text: `👥 **CONVOCATORIA: SESIÓN GENERAL DE LOS 7 BOTS Y TÚ (8 PARTICIPANTES)**\n\nEstás en la **Mesa Redonda de Proyecto 66**. Los 8 participantes en este grupo son **tú y los 7 bots**:\n\n• 👤 **Tú (Comandante)**: Usuario principal, líder de objetivos y decisiones.\n• 🔹 **Yan (CORE-01)**: Coordinación general, moderador y visión holística.\n• 💻 **Kiko (DEV-02)**: Arquitectura, código limpio, GitHub y soporte APK.\n• 🎯 **Max (TAC-03)**: Foco táctico, sprints y metas medibles.\n• 🎨 **Buky (ART-04)**: Identidad visual, atmósfera cyberpunk y arte.\n• 🧭 **Gregoria (SAGE-05)**: Filosofía, auditoría, ciencia y control de riesgos.\n• 💬 **Yanet (VOX-06)**: Comunicación, negociación, síntesis e idiomas.\n• 🎮 **Kuko (FUN-07)**: Gamificación, acertijos, humor y moral del equipo.\n\n*(Aviso de arquitectura: No existe ningún bot llamado Hy; la expresión "hy" en tus notas se refiere a "ahí/hay").*\n\n¿Qué misión o consulta ponemos sobre la mesa para deliberar en equipo?`,
        timestamp: Date.now(),
        suggestedActions: [
          'Todos opinen: ¿Cuál es nuestra prioridad hoy?',
          'Debate de estrategia entre Yan, Max y Gregoria',
          'Kiko y Yanet: Revisión técnica y documentación',
          'Hola a todos los bots de Proyecto 66'
        ]
      };
      setMessages((prev) => [...prev, groupAnnounce]);
    }
  };

  // User sends message
  const handleSendMessage = (userText: string) => {
    stopSpeaking();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      botId: activeBotId,
      text: userText,
      isGroupMessage: isGroupMode,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    if (isGroupMode) {
      setGroupTypingStatus('Yan coordinando la mesa redonda');

      setTimeout(async () => {
        const replies = await generateGroupResponses(userText, messages);
        let delayAcc = 0;

        replies.forEach((rep, index) => {
          delayAcc += index === 0 ? 350 : 750;
          setTimeout(() => {
            const repBot = BOTS_DATA[rep.botId] || BOTS_DATA.yan;
            setGroupTypingStatus(`${repBot.name} interviniendo`);

            const botMessage: ChatMessage = {
              id: `bot-grp-${Date.now()}-${rep.botId}-${index}`,
              sender: 'bot',
              botId: rep.botId,
              isGroupMessage: true,
              text: rep.text,
              timestamp: Date.now(),
              codeSnippet: rep.codeSnippet,
              suggestedActions: rep.suggestedActions
            };

            setMessages((prev) => [...prev, botMessage]);

            if (settings.soundEffects) {
              playCyberSound('receive');
            }

            if (index === replies.length - 1) {
              setIsTyping(false);
              setGroupTypingStatus(null);

              // Auto-save dialogue into learning memory
              saveLearningMemoryEntry(userText, rep.text, rep.botId, 'sistema');

              if (settings.ttsEnabled) {
                speakText(rep.text, repBot, {
                  voiceName: settings.ttsVoiceName,
                  rate: settings.ttsRate,
                  pitch: settings.ttsPitch,
                  onEnd: () => {
                    if (settings.continuousVoiceMode) {
                      setAutoListenCounter((c) => c + 1);
                    }
                  }
                });
              }
            }
          }, delayAcc);
        });
      }, 400);
    } else {
      // Single bot response flow
      const delay = Math.min(1000, Math.max(450, userText.length * 8));

      setTimeout(async () => {
        const responseResult = await generateBotResponse(userText, activeBotId, messages);

        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          botId: activeBotId,
          text: responseResult.text,
          timestamp: Date.now(),
          codeSnippet: responseResult.codeSnippet,
          suggestedActions: responseResult.suggestedActions
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);

        // Auto-save dialogue to sovereign learning memory
        saveLearningMemoryEntry(userText, responseResult.text, activeBotId, 'sistema');

        // Auto-forward bot reply to Telegram if configured
        if (
          telegramConfig.enabled &&
          telegramConfig.autoForwardBotReplies &&
          telegramConfig.botToken &&
          telegramConfig.chatId
        ) {
          const formatted = formatBotMessageForTelegram(activeBot.name, activeBot.code, responseResult.text);
          sendTelegramMessage(telegramConfig.botToken, telegramConfig.chatId, formatted);
        }

        if (settings.soundEffects) {
          playCyberSound('receive');
        }

        if (settings.ttsEnabled) {
          speakText(responseResult.text, activeBot, {
            voiceName: settings.ttsVoiceName,
            rate: settings.ttsRate,
            pitch: settings.ttsPitch,
            onEnd: () => {
              if (settings.continuousVoiceMode) {
                setAutoListenCounter((c) => c + 1);
              }
            }
          });
        }
      }, delay);
    }
  };

  const handleForwardToTelegram = async (message: ChatMessage) => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      setIsTelegramOpen(true);
      return;
    }
    const targetBot = BOTS_DATA[message.botId] || BOTS_DATA.yan;
    const formatted = formatBotMessageForTelegram(targetBot.name, targetBot.code, message.text);
    const res = await sendTelegramMessage(telegramConfig.botToken, telegramConfig.chatId, formatted);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, telegramSent: true } : m))
      );
      if (settings.soundEffects) playCyberSound('send');
    } else {
      if (settings.soundEffects) playCyberSound('error');
    }
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setMessages(INITIAL_MESSAGES);
    try {
      localStorage.removeItem('proyecto66_messages');
    } catch {}
    if (settings.soundEffects) playCyberSound('click');
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    if (settings.soundEffects) playCyberSound('click');
  };

  return (
    <>
      {showMundoxSplash && currentApp === 'juegos' && (
        <MundoxSplashScreen onComplete={() => setShowMundoxSplash(false)} />
      )}
      <AndroidShell
      isFrameEnabled={settings.androidDeviceFrame}
      onToggleFrame={() =>
        setSettings((prev) => ({
          ...prev,
          androidDeviceFrame: !prev.androidDeviceFrame
        }))
      }
      neonIntensity={settings.neonIntensity}
    >
      {/* Top Header (Hidden in DEAD LAN Fullscreen mode to free up 100% of the mobile screen) */}
      {!(currentApp === 'deadlan' && isDeadLanFullscreen) && (
        <Header
          onOpenSettings={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsSettingsOpen(true);
          }}
          onOpenApkGuide={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsApkGuideOpen(true);
          }}
          onOpenBotsOverview={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsBotsOverviewOpen(true);
          }}
          onOpenTelegram={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsTelegramOpen(true);
          }}
          onOpenAuditLog={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsAuditLogOpen(true);
          }}
          onOpenSovereignAi={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsSovereignAiOpen(true);
          }}
          onOpenMarketPanel={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsMarketPanelOpen(true);
          }}
          onOpenCloudNetwork={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsCloudNetworkOpen(true);
          }}
          onOpenSportsBetting={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsSportsBettingOpen(true);
          }}
          onOpenCryptoWallet={() => {
            if (settings.soundEffects) playCyberSound('click');
            setIsCryptoWalletOpen(true);
          }}
          onToggleEmergencyStop={handleToggleEmergencyStop}
          isAutomationStopped={isAutomationStopped}
          onInstallPwa={handleInstallPwa}
          canInstallPwa={canInstallPwa}
          neonIntensity={settings.neonIntensity}
          telegramStatus={telegramConfig.status}
          isContinuousVoiceActive={settings.continuousVoiceMode}
          onToggleContinuousVoice={() => {
            const nextVal = !settings.continuousVoiceMode;
            setSettings((prev) => ({
              ...prev,
              continuousVoiceMode: nextVal,
              ttsEnabled: true
            }));
            if (settings.soundEffects) {
              playCyberSound(nextVal ? 'approve' : 'click');
            }
          }}
        />
      )}

      {/* Emergency Stop Banner (Section 3) */}
      {isAutomationStopped && (
        <div className="bg-rose-950/80 border-b border-rose-500/60 px-3 py-2 text-rose-300 font-mono text-xs flex items-center justify-between shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="font-bold">MODO DETENCIÓN DE EMERGENCIA:</span>
            <span className="hidden sm:inline text-rose-200">
              Tareas autónomas congeladas por seguridad.
            </span>
          </div>
          <button
            onClick={handleToggleEmergencyStop}
            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition text-[11px]"
          >
            Reanudar
          </button>
        </div>
      )}

      {/* 3-App Navigation Switcher (Hidden in DEAD LAN Fullscreen mode) */}
      {!(currentApp === 'deadlan' && isDeadLanFullscreen) && (
        <AppModeSwitcher
          currentApp={currentApp}
          onSelectApp={(app) => {
            setCurrentApp(app);
            if (settings.soundEffects) playCyberSound('switch');
          }}
          neonIntensity={settings.neonIntensity}
        />
      )}

      {/* APPLICATION BODY BY SELECTED MODE */}
      {currentApp === 'deadlan' ? (
        <DeadLanAppView
          isFullscreen={isDeadLanFullscreen}
          onToggleFullscreen={() => setIsDeadLanFullscreen((prev) => !prev)}
          onExitToControl={() => setCurrentApp('control')}
          onSwitchApp={(app) => setCurrentApp(app)}
        />
      ) : currentApp === 'mundox' ? (
        <MundoxAiAppView onBackToApp={() => setCurrentApp('control')} />
      ) : currentApp === 'estudio' ? (
        <StudyAppView />
      ) : currentApp === 'juegos' ? (
        <TelegramGamesHubView onOpenPortada={() => setShowMundoxSplash(true)} />
      ) : (
        /* APK A: PROYECTO 66 CONTROL */
        <>
          {/* 7 Bot Buttons Bar */}
          <BotSelectorBar
            activeBotId={activeBotId}
            onSelectBot={(id) => handleSelectBot(id, true)}
            onInspectBot={(bot) => {
              if (settings.soundEffects) playCyberSound('click');
              setInspectedBot(bot);
            }}
            neonIntensity={settings.neonIntensity}
            isGroupMode={isGroupMode}
            onToggleGroupMode={handleToggleGroupMode}
          />

          {/* Pending Tasks Awaiting User Approval (Rule 3 & 8) */}
          {pendingTasks.filter((t) => t.status === 'pending').length > 0 && (
            <div className="bg-[#050c1e]/60 border-b border-[#00f0ff]/20 px-3 py-1">
              <div className="max-w-4xl mx-auto">
                {pendingTasks
                  .filter((t) => t.status === 'pending')
                  .map((task) => (
                    <TaskApprovalCard
                      key={task.id}
                      task={task}
                      onApprove={handleApproveTask}
                      onReject={handleRejectTask}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Main Chat Stream Container */}
          <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 cyber-grid">
            <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
              {messages.map((message) => (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  settings={settings}
                  onSelectAction={(prompt) => {
                    if (prompt === 'Abrir ventana de Telegram') {
                      setIsTelegramOpen(true);
                    } else if (prompt === 'Abrir guía visual de APK') {
                      setIsApkGuideOpen(true);
                    } else if (prompt === 'Abrir Centro de IA Soberana') {
                      setIsSovereignAiOpen(true);
                    } else if (prompt === 'Abrir Panel Táctico de Mercado') {
                      setIsMarketPanelOpen(true);
                    } else {
                      handleSendMessage(prompt);
                    }
                  }}
                  onInspectBot={(bot) => {
                    if (settings.soundEffects) playCyberSound('click');
                    setInspectedBot(bot);
                  }}
                  onForwardToTelegram={handleForwardToTelegram}
                  isTelegramConnected={telegramConfig.status === 'connected'}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2.5 my-2 animate-fadeIn">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.3)] ${
                    isGroupMode
                      ? 'bg-[#050c1e] border-cyan-400 text-cyan-300'
                      : 'bg-[#050c1e] border-[#00f0ff]/50 text-[#00f0ff]'
                  }`}>
                    {isGroupMode ? <span className="text-sm">👥</span> : <BotIcon id={activeBot.id} className="w-4 h-4" />}
                  </div>
                  <div className="bg-[#050c1e] border border-[#00f0ff]/30 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs font-mono text-[#00f0ff] flex items-center gap-2">
                    <span>{isGroupMode ? (groupTypingStatus || 'Mesa redonda deliberando...') : `${activeBot.name} procesando`}</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Chat Input Bar */}
          <ChatInput
            onSendMessage={handleSendMessage}
            activeBot={activeBot}
            disabled={isTyping}
            soundEnabled={settings.soundEffects}
            onOpenMicDiagnostic={() => setIsMicDiagnosticOpen(true)}
            isGroupMode={isGroupMode}
            isContinuousVoiceActive={settings.continuousVoiceMode}
            onToggleContinuousVoice={() => {
              const nextVal = !settings.continuousVoiceMode;
              setSettings((prev) => ({
                ...prev,
                continuousVoiceMode: nextVal,
                ttsEnabled: true
              }));
              if (settings.soundEffects) {
                playCyberSound(nextVal ? 'approve' : 'click');
              }
            }}
            ttsEnabled={settings.ttsEnabled}
            onToggleTts={() =>
              setSettings((prev) => ({
                ...prev,
                ttsEnabled: !prev.ttsEnabled
              }))
            }
            autoListenCounter={autoListenCounter}
          />
        </>
      )}

      {/* Modals & Dialogs */}
      <BotDossierModal
        bot={inspectedBot}
        isOpen={!!inspectedBot}
        onClose={() => setInspectedBot(null)}
        onSelectAndChat={(botId, initialPrompt) => {
          handleSelectBot(botId, false);
          setInspectedBot(null);
          if (initialPrompt) {
            setTimeout(() => handleSendMessage(initialPrompt), 200);
          }
        }}
        isActive={inspectedBot?.id === activeBotId}
      />

      <BotsOverviewModal
        isOpen={isBotsOverviewOpen}
        onClose={() => setIsBotsOverviewOpen(false)}
        activeBotId={activeBotId}
        onSelectBot={(botId) => {
          handleSelectBot(botId, true);
        }}
        onInspectBot={(bot) => {
          setInspectedBot(bot);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
        onClearHistory={handleClearHistory}
        onResetDefaults={handleResetDefaults}
        onOpenMicDiagnostic={() => setIsMicDiagnosticOpen(true)}
        onOpenSovereignAi={() => setIsSovereignAiOpen(true)}
      />

      <ApkExportModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
        chatHistory={messages}
      />

      <MicrophoneDiagnosticModal
        isOpen={isMicDiagnosticOpen}
        onClose={() => setIsMicDiagnosticOpen(false)}
      />

      <TelegramModal
        isOpen={isTelegramOpen}
        onClose={() => setIsTelegramOpen(false)}
        config={telegramConfig}
        onUpdateConfig={(newCfg) => {
          setTelegramConfig(newCfg);
          saveTelegramConfig(newCfg);
        }}
        soundEnabled={settings.soundEffects}
      />

      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        logs={auditLogs}
        onClearLogs={() => setAuditLogs([])}
      />

      <SovereignAiModal
        isOpen={isSovereignAiOpen}
        onClose={() => setIsSovereignAiOpen(false)}
        knowledgeEntries={knowledgeEntries}
        onAddKnowledgeEntry={handleAddKnowledgeEntry}
        onDeleteKnowledgeEntry={handleDeleteKnowledgeEntry}
        aiConfig={aiConfig}
        onUpdateAiConfig={handleUpdateAiConfig}
      />

      <MarketAnalysisPanel
        isOpen={isMarketPanelOpen}
        onClose={() => setIsMarketPanelOpen(false)}
        onSendToChat={handleSendMessage}
        isEmergencyStopped={isAutomationStopped}
        onToggleEmergencyStop={handleToggleEmergencyStop}
      />

      <CloudNetworkModal
        isOpen={isCloudNetworkOpen}
        onClose={() => setIsCloudNetworkOpen(false)}
        telegramConfig={telegramConfig}
        onOpenTelegramModal={() => setIsTelegramOpen(true)}
      />

      <SportsBettingModal
        isOpen={isSportsBettingOpen}
        onClose={() => setIsSportsBettingOpen(false)}
        telegramBotToken={telegramConfig.botToken}
        telegramChatId={telegramConfig.chatId || "8885707506"}
      />

      <CryptoWalletModal
        isOpen={isCryptoWalletOpen}
        onClose={() => setIsCryptoWalletOpen(false)}
      />
    </AndroidShell>
    </>
  );
}
