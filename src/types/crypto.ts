// ==========================================
// PROYECTO 66: CRYPTO CASINO & MMORPG TYPES
// ==========================================

export type CryptoNetwork = 'BNB_SMART_CHAIN' | 'TELEGRAM_TON' | 'RENDER_CLOUD_VAULT';

export interface CryptoWalletState {
  address: string;
  network: CryptoNetwork;
  networkChainId: number; // 56 for BSC Mainnet, 97 for Testnet
  usdtBalance: number; // BEP-20 USDT
  p66Balance: number;  // Token Soberano P66 (1 USDT = 100 P66)
  warTokenBalance: number; // WARTOKEN ($WARC / $WAR)
  warTokenSymbol: string;
  warTokenName: string;
  telegramChannel: string; // https://t.me/WARTOKEN_Official
  gamesSupported: string[];
  bnbGasBalance: number; // For transaction gas
  isConnected: boolean;
  transactions: CryptoTransaction[];
}

export interface CryptoTransaction {
  id: string;
  hash: string;
  type: 'deposit' | 'withdraw' | 'casino_win' | 'casino_bet' | 'mmorpg_loot' | 'staking_reward' | 'token_creation';
  token: 'USDT' | 'P66' | 'WARC' | 'WAR';
  amount: number;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  note: string;
  bscScanUrl?: string;
}

// ------------------------------------------
// CASINO 66 DEFINITIONS (TRADICIONAL CUBANO & CRIPTO)
// ------------------------------------------
export type CasinoGameType = 
  | 'domino_cubano'   // Dominó Doble 9 Tradicional de Cuba
  | 'charada_cubana'  // La Charada Tradicional Cubana (1 al 100 y la Bolita Criolla)
  | 'poker_cubano'    // Cubilete Cubano con 5 Dados Criollos
  | 'trigo_cubano'    // Trigo Cubano / Ronda con Baraja Española
  | 'solo_cubano'     // El Solo Cubano de Bazas y Triunfos
  | 'poker_cartas'    // Póker Clásico con Baraja de Cartas (5 Cartas / Jacks or Better)
  | 'roulette' 
  | 'blackjack' 
  | 'slots' 
  | 'dice';

export interface CasinoBet {
  gameType: CasinoGameType;
  token: 'P66' | 'USDT';
  amount: number;
  multiplier: number;
  payout: number;
  won: boolean;
  details: string;
  serverSeedHash: string;
  timestamp: number;
}

// ------------------------------------------
// MMORPG EVOLUTION & RACES DEFINITIONS
// ------------------------------------------

export type RaceFaction = 
  | 'linaje_terraqueo' 
  | 'linaje_arcano' 
  | 'linaje_bestial' 
  | 'linaje_ascendido'
  | 'linaje_semihumano'    // Semi-Humanos (Beastfolk / Therianthropes de Manga & Fantasía)
  | 'linaje_anime_manhwa'; // Razas de Anime, Manhwa y Cómics (Solo Leveling, Tensura, Xianxia)

export interface MmorpgRace {
  id: string;
  name: string;
  faction: RaceFaction;
  lore: string;
  racialTrait: string;
  passiveBonus: string;
  element: 'Fuego' | 'Hielo' | 'Rayo' | 'Vacío' | 'Luz' | 'Tierra' | 'Éter' | 'Caos';
  icon: string;
  avatarColor: string;
  // Evolution stages
  evolutions: {
    stage1: string; // Despertar (Lvl 1-25)
    stage2: string; // Transmutación Rúnica (Lvl 25-50)
    stage3: string; // Ascensión Cósmica (Lvl 50-75)
    stage4: string; // Deidad Soberana (Lvl 75-100)
  };
}

export type MmorpgClass = 
  | 'Guerrero del Nexo'
  | 'Archimago Cuántico'
  | 'Pícaro Sombrío'
  | 'Paladín Sagrado'
  | 'Cazador Cósmico'
  | 'Druida Primordial'
  | 'Caballero Sangre Caída'
  | 'Nigromante del Vacío'
  | 'Invocador Dimensional'
  | 'Chamán de Tormentas';

export type NpcDifficulty = 'Normal' | 'Heroico' | 'Mítico' | 'Jefe_Mundial';

export interface MmorpgNpcBoss {
  id: string;
  name: string;
  title: string;
  difficulty: NpcDifficulty; // Lowest is STRICTLY Normal
  level: number;
  maxHp: number;
  currentHp: number;
  attackPower: number;
  defense: number;
  element: string;
  p66RewardMin: number;
  p66RewardMax: number;
  usdtDropChancePercent: number; // Only Heroic/Mythic/WorldBoss
  specialAbility: string;
  avatarIcon: string;
  zone: string;
}

export interface PlayerCharacter {
  name: string;
  raceId: string;
  characterClass: MmorpgClass;
  level: number;
  currentExp: number;
  maxExp: number;
  evolutionTier: 1 | 2 | 3 | 4; // 1: Despertar, 2: Rúnica, 3: Cósmica, 4: Deidad
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  attackPower: number;
  magicPower: number;
  defense: number;
  criticalChancePercent: number;
  equippedWeapon: string;
  equippedArmor: string;
  inventoryP66: number;
  kills: number;
  bossesDefeated: number;
}
