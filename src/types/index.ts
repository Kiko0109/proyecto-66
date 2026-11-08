export type BotId = 'yan' | 'kiko' | 'max' | 'buky' | 'gregoria' | 'yanet' | 'kuko';

export type AppMode = 'control' | 'estudio' | 'juegos' | 'deadlan';

export interface BotInfo {
  id: BotId;
  name: string;
  code: string;
  title: string;
  shortRole: string;
  category: string;
  description: string;
  personality: string;
  accentColor: string;
  glowColor: string;
  avatarIcon: string;
  voicePitch: number;
  voiceRate: number;
  capabilities: string[];
  samplePrompts: string[];
  greeting: string;
  status: 'online' | 'busy' | 'stopped' | 'error';
  lastAction?: string;
  lastActionTime?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  botId: BotId;
  text: string;
  timestamp: number;
  codeSnippet?: {
    language: string;
    code: string;
  };
  suggestedActions?: string[];
  isSpoken?: boolean;
  telegramSent?: boolean;
  isGroupMessage?: boolean;
  taskProposal?: {
    taskId: string;
    title: string;
    description: string;
    riskLevel: 'bajo' | 'medio' | 'alto';
    status: 'pending' | 'approved' | 'rejected' | 'executed';
  };
}

export interface ProposedTask {
  id: string;
  title: string;
  description: string;
  proposedBy: BotId;
  assignedTo: BotId;
  riskLevel: 'bajo' | 'medio' | 'alto';
  requiresApproval: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  timestamp: number;
  executionLog?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  botId: BotId;
  action: string;
  details: string;
  status: 'success' | 'blocked' | 'warning' | 'rejected';
  userApproved?: boolean;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  autoForwardBotReplies: boolean;
  autoForwardUserMessages: boolean;
  botUsername?: string;
  botFirstName?: string;
  botId?: number;
  lastTestedAt?: number;
  status: 'disconnected' | 'connected' | 'error';
  lastError?: string;
}

export interface AppSettings {
  soundEffects: boolean;
  ttsEnabled: boolean;
  ttsVoiceName: string;
  ttsRate: number;
  ttsPitch: number;
  neonIntensity: 'high' | 'medium' | 'subtle';
  fontSize: 'compact' | 'normal' | 'large';
  androidDeviceFrame: boolean;
  hapticFeedback: boolean;
  currentApp: AppMode;
  continuousVoiceMode?: boolean;
  proactiveAiMode?: boolean;
}

export interface LearningDialogueEntry {
  id: string;
  timestamp: number;
  userPrompt: string;
  botReply: string;
  botId: BotId;
  lessonLearned: string;
  category: 'voz' | 'mercado' | 'juegos' | 'token' | 'sistema';
}

export interface StudyDocument {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'txt';
  content: string;
  totalPages: number;
  currentPage: number;
  readingPosition: number;
  readingSpeed: number;
  bookmarks: number[];
  notes: { page: number; text: string; date: number }[];
  isOfflineAvailable: boolean;
  lastReadTimestamp: number;
}

export interface GameItem {
  id: string;
  title: string;
  category: 'tactica' | 'logica' | 'arcade' | 'ciberseguridad' | 'cod_warzone' | 'free_fire' | 'delta_force';
  description: string;
  thumbnail: string;
  type: 'web_embedded' | 'offline_html5';
  isFavorite: boolean;
  highScore?: number;
  lastPlayed?: number;
  checksumVerified: boolean;
  source: 'legitimate_local' | 'authorized_web';
  cloudDownloadUrl?: string;
  gamePackageSize?: string;
  graphicsMode?: string;
  fpsRate?: string;
  tournamentStatus?: string;
  leaderboardRank?: number;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: 'arquitectura' | 'seguridad' | 'bots' | 'manuales' | 'reglas' | 'codigo' | 'aprendizaje';
  content: string;
  updatedAt: number;
  source: string;
  isLocked?: boolean;
}

export interface SovereignAiConfig {
  engineType: 'offline_tactical' | 'local_ollama' | 'local_llamacpp';
  ollamaEndpoint: string;
  selectedModel: string;
  isConnected: boolean;
  lastChecked?: number;
  availableModels: string[];
  maxTokens: number;
  temperature: number;
}

// ==========================================
// TACTICAL MARKET ANALYSIS & PAPER TRADING
// Integrated into Yan & Max (Section 8 Prompt Maestro)
// Max Horizon <= 4 Hours | Zero Real Money Execution
// ==========================================

export type MarketSignalDirection = 'ALCISTA' | 'BAJISTA' | 'SIN SEÑAL CLARA';
export type TimeHorizon = string; // Supports 5m, 15m, 30m, 45m, 1h, 2h, 4h, or any custom value <= 4h (240 min)
export type AssetCategory = 'cripto' | 'metales' | 'acciones';

export type MarketAsset =
  | 'BTC/USDT'
  | 'ETH/USDT'
  | 'SOL/USDT'
  | 'BNB/USDT'
  | 'XRP/USDT'
  | 'XAU/USD (Oro)'
  | 'XAG/USD (Plata)'
  | 'SPY (S&P 500)'
  | 'QQQ (Nasdaq 100)'
  | 'NVDA (Nvidia)'
  | 'TSLA (Tesla)'
  | 'AAPL (Apple)';

export interface CloudStateSnapshot {
  version: string;
  timestamp: number;
  timestampFormatted: string;
  source: 'proyecto66_cloud_sync';
  description: string;
  systemRestStatus: 'active' | 'resting_in_cloud';
  messages: ChatMessage[];
  paperTrades: PaperTrade[];
  pendingTasks: ProposedTask[];
  auditLogs: AuditLogEntry[];
  settings: AppSettings;
  knowledgeEntries: KnowledgeEntry[];
  checksum: string;
}

export interface TechnicalIndicators {
  rsi14: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
    divergence: 'ninguna' | 'alcista' | 'bajista';
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
    percentB: number;
    bandwidth: number;
  };
  ema20: number;
  ema50: number;
  ema200: number;
  atr14: number;
  volume24h: number;
  priceChange24h: number;
  support: number;
  resistance: number;
  trend: 'alcista' | 'bajista' | 'lateral';
}

export interface MarketForecast {
  id: string;
  asset: MarketAsset;
  timeHorizon: TimeHorizon;
  direction: MarketSignalDirection;
  referencePrice: number;
  isCustomPrice?: boolean;
  timestamp: number;
  timestampFormatted: string;
  entryZone: {
    min: number;
    max: number;
  };
  target1: number; // TP1
  target2: number; // TP2
  invalidationLevel: number; // Stop Loss
  riskRewardRatio: string;
  estimatedValidityMinutes: number;
  humanReactionBufferMinutes: number; // Latency buffer (2-5 min) to switch Android apps
  estimatedFeesAndSpread: {
    exchangeFeePercent: number; // e.g. 0.05%
    estimatedSpread: number;
    estimatedSlippage: number;
  };
  invalidationConditions: string[];
  uncertaintyLevel: 'baja' | 'moderada' | 'alta';
  analysisRationale: string[];
  isExpired: boolean;
  isPricePastEntry: boolean;
  currentPrice: number;
  multiTimeframeAlignment: {
    m15: 'alcista' | 'bajista' | 'lateral';
    h1: 'alcista' | 'bajista' | 'lateral';
    h4: 'alcista' | 'bajista' | 'lateral';
    isConcordant: boolean;
  };
  indicators: TechnicalIndicators;
}

export interface PaperTrade {
  id: string;
  forecastId: string;
  asset: MarketAsset;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  target1: number;
  target2: number;
  stopLoss: number;
  currentPrice: number;
  exitPrice?: number;
  status: 'OPEN' | 'TP1_HIT' | 'TP2_HIT' | 'STOPPED_OUT' | 'EXPIRED' | 'CANCELLED';
  pnlPercent: number;
  simulatedMarginUsd: number;
  lotSize?: number; // e.g. 0.01 (micro), 0.10 (mini), 1.00 (estándar), 0.001
  leverage?: number; // e.g. 1x, 2x, 5x, 10x, 20x
  positionSizeUnits?: number; // e.g. 0.0015 BTC o 0.05 oz de oro
  estimatedRiskUsd?: number; // Pérdida máxima en el Stop Loss
  estimatedRewardUsd?: number; // Ganancia estimada en TP1/TP2
  pnlUsd: number;
  openedAt: number;
  closedAt?: number;
  timeHorizon: TimeHorizon;
  notes: string;
}

export interface BacktestResult {
  id: string;
  asset: MarketAsset;
  timeframe: TimeHorizon;
  periodLabel: string;
  totalCandlesTested: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePercent: number;
  initialCapitalUsd: number;
  finalCapitalUsd: number;
  netPnlUsd: number;
  netPnlPercent: number;
  maxDrawdownPercent: number;
  profitFactor: number;
  executedTrades: {
    id: string;
    entryTime: string;
    exitTime: string;
    direction: 'LONG' | 'SHORT';
    entryPrice: number;
    exitPrice: number;
    pnlUsd: number;
    pnlPercent: number;
    outcome: 'TP' | 'SL';
  }[];
  conclusions: string[];
}

export interface UserAllocatedCapital {
  initialCapital: number;
  currentBalance: number;
  allocatedInTrades: number;
  availableBalance: number;
  totalPnlUsd: number;
  totalPnlPercent: number;
  maxRiskPerTradePercent: number;
}

export interface CloudNode {
  id: string;
  name: string;
  provider: string;
  role: string;
  status: 'online' | 'standby' | 'configuring' | 'syncing';
  latencyMs: number;
  lastPing: number;
  uptime: string;
  storageCapacity: string;
  ramCapacity: string;
}

export interface ConnectedServerNode {
  id: string;
  name: string;
  type: 'render' | 'github' | 'huggingface' | 'vps';
  ownerName: string;
  urlOrRepo: string;
  status: 'online' | 'standby' | 'active';
  freeHoursMonthly: number;
  usedHoursMonthly: number;
  storage: string;
  ram: string;
}

export interface StorageCloudNode {
  id: string;
  provider: 'terabox' | 'gdrive' | 'mega' | 'telegram' | 'github_releases' | 'nuvaka' | 'degoo' | 'box' | 'pcloud' | 'proton' | 'koofr' | 'onedrive' | 'rakuten' | 'dropbox' | 'blomp';
  name: string;
  freeCapacityGb: number;
  usedCapacityGb: number;
  status: 'connected' | 'standby' | 'ready_to_link' | 'near_full';
  targetFolderOrLink: string;
  role: string;
  autoFailoverThresholdMb?: number; // Conmutación automática si espacio libre < 100 MB
  priorityOrder?: number;           // Prioridad de llenado
  isCurrentActiveTarget?: boolean;  // Destino activo de escritura
}

export interface CloudNetworkConfig {
  githubRepo: string;
  githubToken: string;
  telegramBotToken: string;
  telegramChatId: string;
  marketApiKey: string;
  marketApiProvider: 'twelvedata' | 'finnhub' | 'alphavantage' | 'binance_public' | 'coingecko_free';
  pingIntervalMinutes: number;
  autoTradingEnabled: boolean;
  commanderTradingStatus: 'STANDBY' | 'ACTIVE'; // Only trade when user explicitly orders
  maxHorizonMinutes: number;
  allocatedCapital: number;
  lastSyncTimestamp: number;
  renderApiKey?: string;
  groqApiKey?: string;
  huggingFaceToken?: string;
  geminiApiKey?: string;
  supabasePublishableKey?: string;
  supabaseUrl?: string;
  connectedServers?: ConnectedServerNode[];
  storageNodes?: StorageCloudNode[];
}

export interface SportsBetPrediction {
  id: string;
  sport: 'futbol' | 'beisbol' | 'baloncesto' | 'tenis';
  match: string;
  tournament: string;
  date: string;
  prediction: string;
  odds: number;
  probabilityPercent: number;
  expectedValuePercent: number; // EV+
  confidencePercent: number;
  source: 'ia_interna' | 'apk_externa' | 'casa_apuestas';
  externalAppOriginal?: string;
  externalFlawDetected?: string;
  status: 'en_estudio' | 'aprobada' | 'descartada' | 'ganada' | 'perdida';
  learningNote: string;
  timestamp: number;
}

export interface SportsBettingLearningStats {
  totalAnalyzed: number;
  correctedFlaws: number;
  simulatedProfitPercent: number;
  learningPhase: 'estudiando' | 'simulando' | 'listo_para_orden';
  learningLogTxtFile: string;
}

