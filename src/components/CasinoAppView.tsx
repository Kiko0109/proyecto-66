import React, { useState, useEffect } from 'react';
import {
  Coins,
  Dices,
  RotateCw,
  Trophy,
  ShieldCheck,
  Zap,
  TrendingUp,
  CircleDollarSign,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  Layers,
  Crown,
  Search,
  Dice5
} from 'lucide-react';
import { CasinoGameType, CryptoWalletState } from '../types/crypto';
import { loadCryptoWallet, addTransaction, swapUsdtToP66, swapP66ToUsdt } from '../utils/cryptoService';
import { playCyberSound } from '../utils/speechUtils';
import { CHARADA_TRADICIONAL_DATA, CharadaItem } from '../data/charadaCubana';

export const CasinoAppView: React.FC = () => {
  const [wallet, setWallet] = useState<CryptoWalletState>(loadCryptoWallet);
  const [activeGame, setActiveGame] = useState<CasinoGameType>('domino_cubano');
  const [selectedToken, setSelectedToken] = useState<'P66' | 'USDT'>('P66');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('¡Bienvenido al Casino Soberano de Juegos Tradicionales Cubanos!');
  const [lastWin, setLastWin] = useState<{ won: boolean; amount: number } | null>(null);

  // ==========================================
  // 1. DOMINÓ CUBANO (DOBLE 9 - 55 FICHAS)
  // ==========================================
  type DominoTile = [number, number];
  const [playerHand, setPlayerHand] = useState<DominoTile[]>([]);
  const [botHand, setBotHand] = useState<DominoTile[]>([]);
  const [boardEnds, setBoardEnds] = useState<[number, number]>([9, 9]); // [leftEnd, rightEnd]
  const [boardHistory, setBoardHistory] = useState<string[]>(['[9|9]']);
  const [dominoGameActive, setDominoGameActive] = useState<boolean>(false);

  // ==========================================
  // 2. TRIGO CUBANO (BARAJA ESPAÑOLA DE 40 CARTAS)
  // ==========================================
  type SpanishCard = { suit: 'Oros' | 'Copas' | 'Espadas' | 'Bastos'; value: number; label: string };
  const [trigoHand, setTrigoHand] = useState<SpanishCard[]>([]);
  const [trigoCanto, setTrigoCanto] = useState<string | null>(null);

  // ==========================================
  // 3. PÓKER CLÁSICO CON CARTAS (BARAJA ESTÁNDAR DE 52 CARTAS)
  // ==========================================
  type CardSuit = '♠' | '♥' | '♦' | '♣';
  interface PokerCard {
    suit: CardSuit;
    value: number; // 2..14 (14 = As)
    label: string; // '2'..'10', 'J', 'Q', 'K', 'A'
    color: 'red' | 'cyan';
  }

  const [pokerCards, setPokerCards] = useState<PokerCard[]>([
    { suit: '♠', value: 14, label: 'A', color: 'cyan' },
    { suit: '♥', value: 13, label: 'K', color: 'red' },
    { suit: '♦', value: 12, label: 'Q', color: 'red' },
    { suit: '♣', value: 11, label: 'J', color: 'cyan' },
    { suit: '♠', value: 10, label: '10', color: 'cyan' }
  ]);
  const [heldCards, setHeldCards] = useState<boolean[]>([false, false, false, false, false]);
  const [pokerPhase, setPokerPhase] = useState<'initial' | 'dealt'>('initial');
  const [remainingDeck, setRemainingDeck] = useState<PokerCard[]>([]);

  // ==========================================
  // 4. EL SOLO CUBANO (BAZAS Y TRIUNFOS)
  // ==========================================
  const [soloTrumpSuit, setSoloTrumpSuit] = useState<'Oros' | 'Copas' | 'Espadas' | 'Bastos'>('Espadas');
  const [soloPlayerCard, setSoloPlayerCard] = useState<SpanishCard | null>(null);
  const [soloBotCard, setSoloBotCard] = useState<SpanishCard | null>(null);
  const [soloScore, setSoloScore] = useState<{ player: number; bot: number }>({ player: 0, bot: 0 });

  // ==========================================
  // 5. LA CHARADA CUBANA (1 AL 100 Y LA BOLITA)
  // ==========================================
  const [selectedCharadaNum, setSelectedCharadaNum] = useState<number>(66);
  const [charadaSearch, setCharadaSearch] = useState<string>('');
  const [charadaWinningNum, setCharadaWinningNum] = useState<number | null>(null);

  // ==========================================
  // 6. CUBILETE CUBANO (5 DADOS CRIOLLOS)
  // ==========================================
  interface CubileteDie {
    label: string;
    symbol: string;
    value: number;
    sub: string;
  }
  const CUBILETE_FACES: CubileteDie[] = [
    { label: 'As', symbol: '🅰️', value: 1, sub: 'As (Comodín)' },
    { label: 'Rey', symbol: '👑', value: 13, sub: 'K' },
    { label: 'Caballo', symbol: '🐎', value: 12, sub: 'Q' },
    { label: 'Sota', symbol: '🗡️', value: 11, sub: 'J' },
    { label: 'Gallego', symbol: '🎱', value: 8, sub: '8' },
    { label: 'Negro', symbol: '🎲', value: 7, sub: '7' }
  ];
  const [cubileteDice, setCubileteDice] = useState<CubileteDie[]>([
    CUBILETE_FACES[0],
    CUBILETE_FACES[1],
    CUBILETE_FACES[2],
    CUBILETE_FACES[3],
    CUBILETE_FACES[4]
  ]);
  const [cubiletePlayName, setCubiletePlayName] = useState<string | null>(null);

  // Sync wallet
  useEffect(() => {
    setWallet(loadCryptoWallet());
  }, []);

  const refreshWallet = () => {
    setWallet(loadCryptoWallet());
  };

  const handleBetChange = (amount: number) => {
    if (selectedToken === 'P66') {
      setBetAmount(Math.max(10, Math.min(amount, wallet.p66Balance)));
    } else {
      setBetAmount(Math.max(1, Math.min(amount, wallet.usdtBalance)));
    }
  };

  // ==========================================
  // LOGICA 1: DOMINÓ CUBANO DOBLE 9
  // ==========================================
  const generateDoble9Deck = (): DominoTile[] => {
    const deck: DominoTile[] = [];
    for (let i = 0; i <= 9; i++) {
      for (let j = i; j <= 9; j++) {
        deck.push([i, j]);
      }
    }
    // Shuffle
    return deck.sort(() => Math.random() - 0.5);
  };

  const startDominoGame = () => {
    const curBalance = selectedToken === 'P66' ? wallet.p66Balance : wallet.usdtBalance;
    if (curBalance < betAmount) {
      setGameMessage('Saldo insuficiente en billetera');
      return;
    }

    addTransaction('casino_bet', selectedToken, betAmount, 'Partida Dominó Cubano Doble 9');
    refreshWallet();

    const deck = generateDoble9Deck();
    const pHand = deck.slice(0, 10);
    const bHand = deck.slice(10, 20);

    setPlayerHand(pHand);
    setBotHand(bHand);
    setBoardEnds([9, 9]);
    setBoardHistory(['[9|9] (Salida Doble 9)']);
    setDominoGameActive(true);
    setGameMessage('Mesa abierta con salida de [9|9]. Es tu turno: empalma una ficha que tenga 9.');
    playCyberSound('click');
  };

  const playDominoTile = (tile: DominoTile, index: number) => {
    if (!dominoGameActive) return;

    const [leftEnd, rightEnd] = boardEnds;
    const [t1, t2] = tile;

    let canPlayLeft = t1 === leftEnd || t2 === leftEnd;
    let canPlayRight = t1 === rightEnd || t2 === rightEnd;

    if (!canPlayLeft && !canPlayRight) {
      setGameMessage(`Esa ficha [${t1}|${t2}] no cuadra en las puntas (${leftEnd} o ${rightEnd}). Elige otra o pasa.`);
      playCyberSound('error');
      return;
    }

    // Determine new end
    let newLeft = leftEnd;
    let newRight = rightEnd;
    let playSide = 'derecha';

    if (canPlayRight) {
      newRight = t1 === rightEnd ? t2 : t1;
      playSide = 'derecha';
    } else {
      newLeft = t1 === leftEnd ? t2 : t1;
      playSide = 'izquierda';
    }

    const updatedHand = playerHand.filter((_, i) => i !== index);
    setPlayerHand(updatedHand);
    setBoardEnds([newLeft, newRight]);
    setBoardHistory(prev => [`Jugaste [${t1}|${t2}] por la ${playSide}`, ...prev.slice(0, 5)]);
    playCyberSound('click');

    // Check Player Victory (Pegarse)
    if (updatedHand.length === 0) {
      const isCapicua = newLeft === newRight;
      const mult = isCapicua ? 4 : 2;
      const winPayout = betAmount * mult;

      addTransaction('casino_win', selectedToken, winPayout, `¡Victoria en Dominó Cubano! ${isCapicua ? '(CAPICÚA 4x)' : '(2x)'}`);
      refreshWallet();
      setLastWin({ won: true, amount: winPayout });
      setDominoGameActive(false);
      setGameMessage(`¡TE PEGASTE! ${isCapicua ? '¡CAPICÚA CUBANA! (4x)' : '¡Victoria limpia!'} Ganaste +${winPayout.toLocaleString()} ${selectedToken}`);
      playCyberSound('approve');
      return;
    }

    // Bot Response Turn
    executeBotDominoTurn(newLeft, newRight, updatedHand);
  };

  const executeBotDominoTurn = (curLeft: number, curRight: number, curPlayerHand: DominoTile[]) => {
    setTimeout(() => {
      // Find playable tile in bot hand
      const playableIndex = botHand.findIndex(([b1, b2]) => b1 === curLeft || b2 === curLeft || b1 === curRight || b2 === curRight);

      if (playableIndex !== -1) {
        const bTile = botHand[playableIndex];
        const [b1, b2] = bTile;
        let nLeft = curLeft;
        let nRight = curRight;

        if (b1 === curRight || b2 === curRight) {
          nRight = b1 === curRight ? b2 : b1;
        } else {
          nLeft = b1 === curLeft ? b2 : b1;
        }

        const updatedBotHand = botHand.filter((_, i) => i !== playableIndex);
        setBotHand(updatedBotHand);
        setBoardEnds([nLeft, nRight]);
        setBoardHistory(prev => [`Rival jugó [${b1}|${b2}]`, ...prev.slice(0, 5)]);

        if (updatedBotHand.length === 0) {
          setDominoGameActive(false);
          setLastWin({ won: false, amount: 0 });
          setGameMessage('El rival se pegó primero. Suerte en la próxima mano.');
          playCyberSound('reject');
          return;
        }
      } else {
        setBoardHistory(prev => ['El rival dio ¡PASE! No lleva ficha.', ...prev.slice(0, 5)]);
      }

      setGameMessage('Turno del jugador. Juega o toca Pase si no llevas.');
    }, 600);
  };

  const handlePlayerPass = () => {
    if (!dominoGameActive) return;
    setBoardHistory(prev => ['Diste ¡PASE!', ...prev.slice(0, 5)]);
    playCyberSound('click');

    // Bot tries to play or checks if Tranca (game closed)
    const [leftEnd, rightEnd] = boardEnds;
    const botPlayable = botHand.some(([b1, b2]) => b1 === leftEnd || b2 === leftEnd || b1 === rightEnd || b2 === rightEnd);

    if (!botPlayable) {
      // TRANCA CUBANA (Nadie lleva ficha - Cuenta de puntos)
      const playerPts = playerHand.reduce((acc, [p1, p2]) => acc + p1 + p2, 0);
      const botPts = botHand.reduce((acc, [b1, b2]) => acc + b1 + b2, 0);

      setDominoGameActive(false);
      if (playerPts < botPts) {
        const winPayout = betAmount * 2;
        addTransaction('casino_win', selectedToken, winPayout, `Ganaste por Tranca (${playerPts} vs ${botPts} pts)`);
        refreshWallet();
        setLastWin({ won: true, amount: winPayout });
        setGameMessage(`¡TRANCA CUBANA! Ganaste con ${playerPts} puntos frente a ${botPts} del rival. (+${winPayout.toLocaleString()} ${selectedToken})`);
        playCyberSound('approve');
      } else {
        setLastWin({ won: false, amount: 0 });
        setGameMessage(`Tranca: El rival tenía menos puntos (${botPts} vs tus ${playerPts}).`);
        playCyberSound('reject');
      }
      return;
    }

    executeBotDominoTurn(leftEnd, rightEnd, playerHand);
  };

  // ==========================================
  // LOGICA 2: TRIGO CUBANO (RONDA)
  // ==========================================
  const getRandomSpanishCard = (): SpanishCard => {
    const suits: SpanishCard['suit'][] = ['Oros', 'Copas', 'Espadas', 'Bastos'];
    const values = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
    const s = suits[Math.floor(Math.random() * suits.length)];
    const v = values[Math.floor(Math.random() * values.length)];
    const labels: Record<number, string> = { 1: 'As', 10: 'Sota', 11: 'Caballo', 12: 'Rey' };
    return { suit: s, value: v, label: labels[v] || `${v}` };
  };

  const dealTrigoCards = () => {
    const curBalance = selectedToken === 'P66' ? wallet.p66Balance : wallet.usdtBalance;
    if (curBalance < betAmount) {
      setGameMessage('Saldo insuficiente');
      return;
    }

    setIsProcessing(true);
    addTransaction('casino_bet', selectedToken, betAmount, 'Mano de Trigo Cubano / Ronda');
    refreshWallet();
    playCyberSound('click');

    setTimeout(() => {
      const c1 = getRandomSpanishCard();
      const c2 = getRandomSpanishCard();
      const c3 = getRandomSpanishCard();
      const hand = [c1, c2, c3];
      setTrigoHand(hand);

      let canto = 'Sin Canto';
      let mult = 0;
      let won = false;

      // 1. Tercia (3 del mismo número)
      if (c1.value === c2.value && c2.value === c3.value) {
        canto = '¡TERCIA MAYOR! (25x)';
        mult = 25;
        won = true;
      }
      // 2. Trigo (3 del mismo palo)
      else if (c1.suit === c2.suit && c2.suit === c3.suit) {
        canto = `¡TRIGO DE ${c1.suit.toUpperCase()}! (10x)`;
        mult = 10;
        won = true;
      }
      // 3. Ronda (Pareja del mismo número)
      else if (c1.value === c2.value || c2.value === c3.value || c1.value === c3.value) {
        canto = '¡RONDA CUBANA! (Pareja 3x)';
        mult = 3;
        won = true;
      }

      setTrigoCanto(canto);

      if (won) {
        const winPayout = betAmount * mult;
        addTransaction('casino_win', selectedToken, winPayout, `Ganancia Trigo Cubano: ${canto}`);
        refreshWallet();
        setLastWin({ won: true, amount: winPayout });
        setGameMessage(`¡${canto}! Ganaste +${winPayout.toLocaleString()} ${selectedToken}`);
        playCyberSound('approve');
      } else {
        setLastWin({ won: false, amount: 0 });
        setGameMessage(`Cartas: [${c1.label} de ${c1.suit}, ${c2.label} de ${c2.suit}, ${c3.label} de ${c3.suit}]. Sin canto.`);
        playCyberSound('reject');
      }
      setIsProcessing(false);
    }, 700);
  };

  // ==========================================
  // LOGICA 3: PÓKER NORMAL CON CARTAS (BARAJA ESTÁNDAR 52 CARTAS)
  // ==========================================
  const generatePokerDeck = (): PokerCard[] => {
    const suits: { suit: CardSuit; color: 'red' | 'cyan' }[] = [
      { suit: '♠', color: 'cyan' },
      { suit: '♥', color: 'red' },
      { suit: '♦', color: 'red' },
      { suit: '♣', color: 'cyan' }
    ];
    const ranks = [
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10' },
      { value: 11, label: 'J' },
      { value: 12, label: 'Q' },
      { value: 13, label: 'K' },
      { value: 14, label: 'A' }
    ];

    const deck: PokerCard[] = [];
    suits.forEach(s => {
      ranks.forEach(r => {
        deck.push({
          suit: s.suit,
          color: s.color,
          value: r.value,
          label: r.label
        });
      });
    });

    return deck.sort(() => Math.random() - 0.5);
  };

  const startPokerGame = () => {
    const curBalance = selectedToken === 'P66' ? wallet.p66Balance : wallet.usdtBalance;
    if (curBalance < betAmount) {
      setGameMessage('Saldo insuficiente en billetera');
      return;
    }

    setIsProcessing(true);
    addTransaction('casino_bet', selectedToken, betAmount, 'Mano de Póker Tradicional con Cartas');
    refreshWallet();
    playCyberSound('click');

    setTimeout(() => {
      const deck = generatePokerDeck();
      const initialCards = deck.slice(0, 5);
      const remaining = deck.slice(5);

      setPokerCards(initialCards);
      setRemainingDeck(remaining);
      setHeldCards([false, false, false, false, false]);
      setPokerPhase('dealt');
      setIsProcessing(false);
      setGameMessage('Mano repartida. Toca las cartas que quieras RESERVAR (HOLD) y pulsa "DESCARTAR Y CAMBIAR".');
      playCyberSound('click');
    }, 500);
  };

  const drawPokerHand = () => {
    if (pokerPhase !== 'dealt') return;
    setIsProcessing(true);
    playCyberSound('click');

    setTimeout(() => {
      let deckIdx = 0;
      const finalHand = pokerCards.map((c, i) => {
        if (heldCards[i]) return c;
        const newCard = remainingDeck[deckIdx];
        deckIdx++;
        return newCard || c;
      });

      setPokerCards(finalHand);
      setPokerPhase('initial');
      setIsProcessing(false);
      evaluatePokerHand(finalHand);
    }, 600);
  };

  const evaluatePokerHand = (cards: PokerCard[]) => {
    const sorted = [...cards].sort((a, b) => a.value - b.value);
    const values = sorted.map(c => c.value);
    const suits = sorted.map(c => c.suit);

    const counts: Record<number, number> = {};
    values.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    const countPairs = Object.entries(counts)
      .map(([v, count]) => ({ val: Number(v), count }))
      .sort((a, b) => b.count - a.count || b.val - a.val);

    const isFlush = suits.every(s => s === suits[0]);

    // Straight check (including low Ace: A-2-3-4-5)
    let isStraight = false;
    let isAceLowStraight = false;
    const isConsecutive = values[4] - values[0] === 4 && new Set(values).size === 5;
    if (isConsecutive) {
      isStraight = true;
    } else if (values[0] === 2 && values[1] === 3 && values[2] === 4 && values[3] === 5 && values[4] === 14) {
      isStraight = true;
      isAceLowStraight = true;
    }

    let handName = 'Carta Alta (Sin premio)';
    let mult = 0;
    let won = false;

    if (isFlush && isStraight && values[4] === 14 && !isAceLowStraight) {
      handName = '¡ESCALERA REAL DE COLOR! (250x)';
      mult = 250;
      won = true;
    } else if (isFlush && isStraight) {
      handName = '¡ESCALERA DE COLOR! (50x)';
      mult = 50;
      won = true;
    } else if (countPairs[0].count === 4) {
      handName = '¡PÓKER! Cuatro cartas del mismo valor (25x)';
      mult = 25;
      won = true;
    } else if (countPairs[0].count === 3 && countPairs[1]?.count === 2) {
      handName = '¡FULL HOUSE! Trío y Pareja (9x)';
      mult = 9;
      won = true;
    } else if (isFlush) {
      handName = '¡COLOR! Cinco cartas del mismo palo (6x)';
      mult = 6;
      won = true;
    } else if (isStraight) {
      handName = '¡ESCALERA! Cinco números seguidos (4x)';
      mult = 4;
      won = true;
    } else if (countPairs[0].count === 3) {
      handName = '¡TRÍO! Tres cartas iguales (3x)';
      mult = 3;
      won = true;
    } else if (countPairs[0].count === 2 && countPairs[1]?.count === 2) {
      handName = '¡DOBLE PAREJA! (2x)';
      mult = 2;
      won = true;
    } else if (countPairs[0].count === 2 && countPairs[0].val >= 11) {
      handName = '¡PAREJA DE JOTAS O MEJOR! (1.5x)';
      mult = 1.5;
      won = true;
    }

    if (won) {
      const winPayout = Math.floor(betAmount * mult);
      addTransaction('casino_win', selectedToken, winPayout, `Póker Clásico de Cartas: ${handName}`);
      refreshWallet();
      setLastWin({ won: true, amount: winPayout });
      setGameMessage(`¡${handName}! Ganaste +${winPayout.toLocaleString()} ${selectedToken}`);
      playCyberSound('approve');
    } else {
      setLastWin({ won: false, amount: 0 });
      setGameMessage(`Mano final: [${cards.map(c => `${c.label}${c.suit}`).join(' ')}]. No alcanzó premio mínimo (Jotas o mejor).`);
      playCyberSound('reject');
    }
  };

  // ==========================================
  // LOGICA 4: EL SOLO CUBANO (BAZAS Y TRIUNFOS)
  // ==========================================
  const playSoloTrick = () => {
    const curBalance = selectedToken === 'P66' ? wallet.p66Balance : wallet.usdtBalance;
    if (curBalance < betAmount) {
      setGameMessage('Saldo insuficiente');
      return;
    }

    setIsProcessing(true);
    addTransaction('casino_bet', selectedToken, betAmount, `Partida de El Solo Cubano (Triunfo: ${soloTrumpSuit})`);
    refreshWallet();
    playCyberSound('click');

    setTimeout(() => {
      const pCard = getRandomSpanishCard();
      const bCard = getRandomSpanishCard();
      setSoloPlayerCard(pCard);
      setSoloBotCard(bCard);

      let playerWins = false;

      // Trump rules
      const pIsTrump = pCard.suit === soloTrumpSuit;
      const bIsTrump = bCard.suit === soloTrumpSuit;

      if (pIsTrump && !bIsTrump) {
        playerWins = true;
      } else if (!pIsTrump && bIsTrump) {
        playerWins = false;
      } else if (pCard.suit === bCard.suit) {
        playerWins = pCard.value >= bCard.value;
      } else {
        playerWins = pCard.value >= bCard.value;
      }

      if (playerWins) {
        const winPayout = Math.floor(betAmount * 2.2);
        addTransaction('casino_win', selectedToken, winPayout, `Ganaste baza de El Solo (${pCard.label} vs ${bCard.label})`);
        refreshWallet();
        setLastWin({ won: true, amount: winPayout });
        setGameMessage(`¡BAZA GANADA EN EL SOLO! Tu ${pCard.label} de ${pCard.suit} superó al ${bCard.label} de ${bCard.suit}. Ganaste +${winPayout.toLocaleString()} ${selectedToken}`);
        playCyberSound('approve');
      } else {
        setLastWin({ won: false, amount: 0 });
        setGameMessage(`Baza perdida: El rival sacó ${bCard.label} de ${bCard.suit} frente a tu ${pCard.label} de ${pCard.suit}.`);
        playCyberSound('reject');
      }
      setIsProcessing(false);
    }, 800);
  };

  // ==========================================
  // LOGICA 5: LA CHARADA CUBANA (TIRADA DE LA BOLITA)
  // ==========================================
  const playCharadaRoll = () => {
    const curBalance = selectedToken === 'P66' ? wallet.p66Balance : wallet.usdtBalance;
    if (curBalance < betAmount) {
      setGameMessage('Saldo insuficiente en billetera para jugar a la Charada');
      return;
    }

    setIsProcessing(true);
    addTransaction('casino_bet', selectedToken, betAmount, `Tirada Charada Cubana: Número ${selectedCharadaNum}`);
    refreshWallet();
    playCyberSound('click');

    setTimeout(() => {
      const drawn = Math.floor(Math.random() * 100) + 1;
      setCharadaWinningNum(drawn);

      const drawnItem = CHARADA_TRADICIONAL_DATA.find(c => c.number === drawn);
      const chosenItem = CHARADA_TRADICIONAL_DATA.find(c => c.number === selectedCharadaNum);

      let won = false;
      let mult = 0;
      let prizeType = '';

      if (drawn === selectedCharadaNum) {
        // PLENO EXACTO
        won = true;
        mult = 50;
        prizeType = '¡PLENO DIRECTO A LA BOLITA CUBANA! (50x)';
      } else if (Math.floor((drawn - 1) / 10) === Math.floor((selectedCharadaNum - 1) / 10)) {
        // MISMA DECENA
        won = true;
        mult = 4;
        prizeType = '¡ACIERTO DE DECENA CUBANA! (4x)';
      } else if (drawn % 10 === selectedCharadaNum % 10) {
        // TERMINAL
        won = true;
        mult = 3;
        prizeType = '¡TERMINAL COINCIDENTE! (3x)';
      }

      if (won) {
        const winPayout = Math.floor(betAmount * mult);
        addTransaction('casino_win', selectedToken, winPayout, `Ganancia Charada: ${prizeType}`);
        refreshWallet();
        setLastWin({ won: true, amount: winPayout });
        setGameMessage(`¡${prizeType}! Salió el #${drawn} (${drawnItem?.name}). Tu número #${selectedCharadaNum} (${chosenItem?.name}) cobró +${winPayout.toLocaleString()} ${selectedToken}!`);
        playCyberSound('approve');
      } else {
        setLastWin({ won: false, amount: 0 });
        setGameMessage(`Salió el #${drawn} [${drawnItem?.name} - ${drawnItem?.folkMeanings[0]}]. Tu número jugado era #${selectedCharadaNum} [${chosenItem?.name}]. ¡Suerte en la próxima tirada!`);
        playCyberSound('reject');
      }
      setIsProcessing(false);
    }, 900);
  };

  // ==========================================
  // LOGICA 6: CUBILETE CUBANO (5 DADOS CRIOLLOS)
  // ==========================================
  const playCubileteRoll = () => {
    const curBalance = selectedToken === 'P66' ? wallet.p66Balance : wallet.usdtBalance;
    if (curBalance < betAmount) {
      setGameMessage('Saldo insuficiente para tirar el cubilete');
      return;
    }

    setIsProcessing(true);
    addTransaction('casino_bet', selectedToken, betAmount, 'Tirada de Cubilete Cubano (5 Dados)');
    refreshWallet();
    playCyberSound('click');

    setTimeout(() => {
      const rolled: CubileteDie[] = Array.from({ length: 5 }, () => {
        return CUBILETE_FACES[Math.floor(Math.random() * CUBILETE_FACES.length)];
      });
      setCubileteDice(rolled);

      // Frecuencias
      const counts: Record<string, number> = {};
      rolled.forEach(d => {
        counts[d.label] = (counts[d.label] || 0) + 1;
      });

      const freqVals = Object.values(counts).sort((a, b) => b - a);
      const asCount = counts['As'] || 0;

      let jugada = 'Tiro Suelto';
      let mult = 0;
      let won = false;

      if (asCount === 5) {
        jugada = '¡CARABINA DE ASES SOBERANA! (100x)';
        mult = 100;
        won = true;
      } else if (freqVals[0] === 5) {
        jugada = '¡CARABINA NATURAL! (50x)';
        mult = 50;
        won = true;
      } else if (freqVals[0] === 4 && asCount >= 1) {
        jugada = '¡CARABINA SUCIA CON AS! (25x)';
        mult = 25;
        won = true;
      } else if (freqVals[0] === 4) {
        jugada = '¡PÓKER DE DADOS! (15x)';
        mult = 15;
        won = true;
      } else if (freqVals[0] === 3 && freqVals[1] === 2) {
        jugada = '¡FULL CUBANO! Tres y Dos (8x)';
        mult = 8;
        won = true;
      } else if (freqVals[0] === 3) {
        jugada = '¡TERCIA CUBANA! (3x)';
        mult = 3;
        won = true;
      } else if (freqVals[0] === 2 && freqVals[1] === 2) {
        jugada = '¡DOS PAREJAS! (2x)';
        mult = 2;
        won = true;
      } else if (freqVals[0] === 2 && (counts['As'] || counts['Rey'])) {
        jugada = '¡PAREJA DE AS O REY! (1.2x)';
        mult = 1.2;
        won = true;
      }

      setCubiletePlayName(jugada);

      if (won) {
        const winPayout = Math.floor(betAmount * mult);
        addTransaction('casino_win', selectedToken, winPayout, `Cubilete Cubano: ${jugada}`);
        refreshWallet();
        setLastWin({ won: true, amount: winPayout });
        setGameMessage(`¡${jugada}! Ganaste +${winPayout.toLocaleString()} ${selectedToken}!`);
        playCyberSound('approve');
      } else {
        setLastWin({ won: false, amount: 0 });
        setGameMessage(`Tirada: [${rolled.map(r => r.label).join(' - ')}]. Suelto sin jugada premiada.`);
        playCyberSound('reject');
      }
      setIsProcessing(false);
    }, 850);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Banner: Balances & Token Selector */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#050c1e] border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
            <CircleDollarSign className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Casino Tradicional Cubano 66
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                BEP-20 ACTIVO
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs mt-0.5">
              <span className="text-[#00f0ff]">
                Token P66: <strong>{wallet.p66Balance.toLocaleString()}</strong>
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-emerald-400">
                USDT: <strong>${wallet.usdtBalance.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Currency Switch & Quick Swap */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-[#030712] p-1 border border-gray-800">
            <button
              onClick={() => setSelectedToken('P66')}
              className={`px-3 py-1 text-xs rounded font-bold transition-all ${
                selectedToken === 'P66'
                  ? 'bg-[#00f0ff] text-black shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Token P66
            </button>
            <button
              onClick={() => setSelectedToken('USDT')}
              className={`px-3 py-1 text-xs rounded font-bold transition-all ${
                selectedToken === 'USDT'
                  ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              USDT BEP-20
            </button>
          </div>

          <button
            onClick={() => {
              if (selectedToken === 'USDT' && wallet.usdtBalance >= 10) {
                swapUsdtToP66(10);
                refreshWallet();
                playCyberSound('approve');
              } else if (selectedToken === 'P66' && wallet.p66Balance >= 1000) {
                swapP66ToUsdt(1000);
                refreshWallet();
                playCyberSound('approve');
              }
            }}
            title="Swap Rápido: 10 USDT <-> 1,000 P66"
            className="p-2 rounded-lg bg-[#030712] border border-[#00f0ff]/20 text-gray-300 hover:text-[#00f0ff] text-xs flex items-center gap-1"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="hidden sm:inline">Swap 1:100</span>
          </button>
        </div>
      </div>

      {/* Cuban Games Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => {
            setActiveGame('domino_cubano');
            playCyberSound('click');
          }}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            activeGame === 'domino_cubano'
              ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-[#050c1e] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span>🀄 Dominó Doble 9</span>
        </button>

        <button
          onClick={() => {
            setActiveGame('charada_cubana');
            playCyberSound('click');
          }}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            activeGame === 'charada_cubana'
              ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-[#050c1e] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span>🔮 Charada (1-100)</span>
        </button>

        <button
          onClick={() => {
            setActiveGame('poker_cubano');
            playCyberSound('click');
          }}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            activeGame === 'poker_cubano'
              ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-[#050c1e] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span>🎲 Cubilete Criollo</span>
        </button>

        <button
          onClick={() => {
            setActiveGame('trigo_cubano');
            playCyberSound('click');
          }}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            activeGame === 'trigo_cubano'
              ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-[#050c1e] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span>🌾 Trigo (Ronda)</span>
        </button>

        <button
          onClick={() => {
            setActiveGame('solo_cubano');
            playCyberSound('click');
          }}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            activeGame === 'solo_cubano'
              ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-[#050c1e] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span>♠️ El Solo Cubano</span>
        </button>

        <button
          onClick={() => {
            setActiveGame('poker_cartas');
            playCyberSound('click');
          }}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            activeGame === 'poker_cartas'
              ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-[#050c1e] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span>🃏 Póker Clásico</span>
        </button>
      </div>

      {/* Main Game Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#040816] border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative overflow-hidden">
        
        {/* Bet Controller Bar */}
        <div className="mb-4 p-3 rounded-xl bg-[#020510] border border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Apuesta ({selectedToken}):</span>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => handleBetChange(Number(e.target.value))}
              className="w-24 px-2 py-1 rounded bg-[#030712] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-bold text-center focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => handleBetChange(selectedToken === 'P66' ? 50 : 2)}
              className="px-2 py-1 rounded bg-[#050c1e] hover:bg-[#00f0ff]/20 text-gray-300 border border-gray-800"
            >
              Min
            </button>
            <button
              onClick={() => handleBetChange(betAmount * 2)}
              className="px-2 py-1 rounded bg-[#050c1e] hover:bg-[#00f0ff]/20 text-gray-300 border border-gray-800"
            >
              2x
            </button>
            <button
              onClick={() => handleBetChange(Math.floor(betAmount / 2))}
              className="px-2 py-1 rounded bg-[#050c1e] hover:bg-[#00f0ff]/20 text-gray-300 border border-gray-800"
            >
              1/2
            </button>
            <button
              onClick={() => handleBetChange(selectedToken === 'P66' ? wallet.p66Balance : wallet.usdtBalance)}
              className="px-2 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-bold"
            >
              Max
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* GAME 1: DOMINÓ CUBANO (DOBLE 9)                      */}
        {/* ==================================================== */}
        {activeGame === 'domino_cubano' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                🀄 Mesa de Dominó Tradicional (55 Fichas hasta el Doble Nueve)
              </span>
              <span className="text-[#00f0ff]">Capicúa paga 4x • Pegada normal 2x</span>
            </div>

            {/* Domino Table Board */}
            <div className="p-4 rounded-xl bg-[#020510] border border-emerald-500/30 flex flex-col items-center justify-center min-h-[120px] space-y-3">
              <div className="text-xs text-gray-400">Puntas de la Mesa:</div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-white text-black font-black text-2xl flex items-center justify-center shadow-lg border-2 border-emerald-400">
                  {boardEnds[0]}
                </div>
                <div className="text-xs text-emerald-400 uppercase tracking-widest font-bold">
                  ↔ CADENA DOBLE 9 ↔
                </div>
                <div className="w-14 h-14 rounded-xl bg-white text-black font-black text-2xl flex items-center justify-center shadow-lg border-2 border-emerald-400">
                  {boardEnds[1]}
                </div>
              </div>

              {/* Board History / Play Log */}
              <div className="flex flex-wrap gap-1.5 justify-center text-[10px] text-gray-400">
                {boardHistory.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Player Hand Tiles */}
            {dominoGameActive ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Tus Fichas ({playerHand.length} restantes) - Toca una para empalmar:</span>
                  <span className="text-emerald-400">Rival tiene {botHand.length} fichas</span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center p-3 rounded-xl bg-[#030712] border border-gray-800">
                  {playerHand.map((tile, i) => {
                    const isPlayable = tile[0] === boardEnds[0] || tile[1] === boardEnds[0] || tile[0] === boardEnds[1] || tile[1] === boardEnds[1];
                    return (
                      <button
                        key={i}
                        onClick={() => playDominoTile(tile, i)}
                        className={`w-12 h-20 rounded-lg flex flex-col items-center justify-between p-1.5 transition-all shadow-md ${
                          isPlayable
                            ? 'bg-white text-black border-2 border-[#00f0ff] hover:scale-105 shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer'
                            : 'bg-gray-200 text-gray-800 opacity-60 border border-gray-400'
                        }`}
                      >
                        <span className="text-sm font-black">{tile[0]}</span>
                        <div className="w-full h-0.5 bg-black" />
                        <span className="text-sm font-black">{tile[1]}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-3 pt-1">
                  <button
                    onClick={handlePlayerPass}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase shadow-md transition"
                  >
                    Dudar / Dar ¡PASE!
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={startDominoGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-sm uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:opacity-95"
              >
                ENTRAR A LA MESA DE DOMINÓ CUBANO ({betAmount} {selectedToken})
              </button>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* GAME: LA CHARADA TRADICIONAL CUBANA (1 AL 100)      */}
        {/* ==================================================== */}
        {activeGame === 'charada_cubana' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                🔮 La Charada Cubana Tradicional (Los 100 Números de la Bolita)
              </span>
              <span className="text-amber-400">Pleno (50x) • Decena (4x) • Terminal (3x)</span>
            </div>

            {/* Selected Number & Ball Result */}
            <div className="p-4 rounded-xl bg-[#020510] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex flex-col items-center justify-center font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  <span className="text-2xl font-black">#{selectedCharadaNum}</span>
                  <span className="text-[9px] uppercase font-bold tracking-tighter">Elegido</span>
                </div>
                <div>
                  <div className="text-xs text-amber-400 uppercase tracking-widest font-bold">
                    Tu Selección:
                  </div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    {CHARADA_TRADICIONAL_DATA.find(c => c.number === selectedCharadaNum)?.emoji}{' '}
                    {CHARADA_TRADICIONAL_DATA.find(c => c.number === selectedCharadaNum)?.name}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Significados: {CHARADA_TRADICIONAL_DATA.find(c => c.number === selectedCharadaNum)?.folkMeanings.join(', ')}
                  </div>
                </div>
              </div>

              {/* Bolita sacada */}
              <div className="flex items-center gap-3 bg-[#050c1e] px-4 py-2.5 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400">Bolita del Tiro:</span>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 text-black flex items-center justify-center font-black text-lg shadow-[0_0_12px_rgba(0,240,255,0.5)]">
                  {charadaWinningNum !== null ? `#${charadaWinningNum}` : '?'}
                </div>
              </div>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por sueño o palabra (ej: caballo, dinero, muerto, gato, lluvia...)"
                value={charadaSearch}
                onChange={(e) => setCharadaSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#030712] border border-gray-800 text-xs text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* 100 Numbers Grid (Scrollable) */}
            <div className="max-h-56 overflow-y-auto p-2 rounded-xl bg-[#020510] border border-gray-800 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
              {CHARADA_TRADICIONAL_DATA
                .filter(item => {
                  if (!charadaSearch) return true;
                  const q = charadaSearch.toLowerCase();
                  return (
                    item.number.toString().includes(q) ||
                    item.name.toLowerCase().includes(q) ||
                    item.folkMeanings.some(m => m.toLowerCase().includes(q))
                  );
                })
                .map(item => (
                  <button
                    key={item.number}
                    onClick={() => {
                      setSelectedCharadaNum(item.number);
                      playCyberSound('click');
                    }}
                    className={`p-1.5 rounded-lg border text-left transition-all ${
                      selectedCharadaNum === item.number
                        ? 'bg-amber-400 text-black border-amber-300 shadow-md scale-[1.02]'
                        : 'bg-[#050c1e] hover:bg-gray-800 border-gray-800 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>#{item.number}</span>
                      <span>{item.emoji}</span>
                    </div>
                    <div className="text-[10px] font-semibold truncate">{item.name}</div>
                  </button>
                ))}
            </div>

            <button
              onClick={playCharadaRoll}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-sm uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:opacity-95 disabled:opacity-50"
            >
              {isProcessing ? 'GIRANDO LA BOLITA CUBANA...' : `TIRAR LA BOLITA CUBANA AL #${selectedCharadaNum} (${betAmount} ${selectedToken})`}
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* GAME: CUBILETE CUBANO (5 DADOS CRIOLLOS)              */}
        {/* ==================================================== */}
        {activeGame === 'poker_cubano' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                🎲 Cubilete Criollo (Póker de Cantina Cubana con 5 Dados)
              </span>
              <span className="text-cyan-400">Carabina Ases (100x) • Natural (50x) • Full (8x)</span>
            </div>

            {/* Leather Cup & Dice Mat */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#071329] to-[#020510] border border-cyan-500/30 flex flex-col items-center justify-center space-y-4 shadow-inner">
              <div className="text-center">
                <div className="text-xs text-cyan-400 uppercase tracking-widest font-bold">
                  Tapete de Jugada Criolla
                </div>
                {cubiletePlayName && (
                  <div className="text-sm font-black text-amber-400 mt-1 animate-pulse">
                    {cubiletePlayName}
                  </div>
                )}
              </div>

              {/* 5 Dice Display */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
                {cubileteDice.map((die, idx) => (
                  <div
                    key={idx}
                    className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white text-slate-900 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] flex flex-col items-center justify-center transition-all transform hover:-translate-y-1"
                  >
                    <span className="text-2xl sm:text-3xl">{die.symbol}</span>
                    <span className="text-[10px] font-black uppercase text-slate-900 mt-0.5">
                      {die.label}
                    </span>
                    <span className="text-[8px] font-bold text-gray-500">
                      {die.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cubilete Paytable Mini Badges */}
              <div className="flex flex-wrap gap-1.5 justify-center text-[10px]">
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-amber-300">Carabina Ases: 100x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-purple-300">Carabina Natural: 50x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-cyan-300">Carabina Sucia: 25x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-blue-300">Póker: 15x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-emerald-300">Full Cubano: 8x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-teal-300">Tercia: 3x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">Dos Parejas: 2x</span>
              </div>
            </div>

            <button
              onClick={playCubileteRoll}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-sm uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-95 disabled:opacity-50"
            >
              {isProcessing ? 'SACUDIENDO EL CUBILETE...' : `SACUDIR CUBILETE Y TIRAR DADOS (${betAmount} ${selectedToken})`}
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* GAME 2: TRIGO CUBANO / RONDA (BARAJA ESPAÑOLA)        */}
        {/* ==================================================== */}
        {activeGame === 'trigo_cubano' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                🌾 Trigo Cubano & Ronda (Baraja Española de 40 Cartas)
              </span>
              <span className="text-amber-400">Trigo (10x) • Ronda (3x) • Tercia (25x)</span>
            </div>

            {/* Hand Preview */}
            <div className="p-6 rounded-xl bg-[#020510] border border-amber-500/30 flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center gap-3">
                {trigoHand.length === 0 ? (
                  <span className="text-gray-500 text-xs italic py-6">
                    Presiona Repartir para recibir tus 3 cartas de baraja española
                  </span>
                ) : (
                  trigoHand.map((c, i) => (
                    <div
                      key={i}
                      className="w-20 h-28 rounded-xl bg-amber-50 text-black border-2 border-amber-600 flex flex-col items-center justify-between p-2 shadow-lg"
                    >
                      <div className="flex justify-between w-full text-xs font-black">
                        <span>{c.label}</span>
                        <span>{c.suit === 'Oros' ? '🟡' : c.suit === 'Copas' ? '🍷' : c.suit === 'Espadas' ? '⚔️' : '🪵'}</span>
                      </div>
                      <span className="text-xl font-bold">
                        {c.suit === 'Oros' ? '🟡' : c.suit === 'Copas' ? '🍷' : c.suit === 'Espadas' ? '⚔️' : '🪵'}
                      </span>
                      <div className="text-[10px] font-bold text-gray-700">
                        {c.suit}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {trigoCanto && (
                <div className="text-xs font-bold text-amber-400">
                  Canto de la Mesa: {trigoCanto}
                </div>
              )}
            </div>

            <button
              onClick={dealTrigoCards}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-sm uppercase shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:opacity-95 disabled:opacity-50"
            >
              {isProcessing ? 'REPARTIENDO BARAJA...' : `CANTAR TRIGO / RONDA (${betAmount} ${selectedToken})`}
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* GAME 3: PÓKER TRADICIONAL CON CARTAS (5-CARD DRAW)   */}
        {/* ==================================================== */}
        {(activeGame === 'poker_cartas' || activeGame === 'poker_cubano') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                🃏 Póker Tradicional con Cartas (Baraja Estándar de 52 Cartas)
              </span>
              <span className="text-[#00f0ff]">Escalera Real (250x) • Póker (25x) • Color (6x)</span>
            </div>

            {/* 5 Poker Cards Display */}
            <div className="p-4 sm:p-6 rounded-xl bg-[#020510] border border-[#00f0ff]/30 flex flex-col items-center justify-center space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {pokerCards.map((card, i) => {
                  const isHeld = heldCards[i];
                  const isRed = card.color === 'red';
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (pokerPhase === 'dealt') {
                          const updated = [...heldCards];
                          updated[i] = !updated[i];
                          setHeldCards(updated);
                          playCyberSound('click');
                        }
                      }}
                      className={`w-16 sm:w-20 h-24 sm:h-28 rounded-xl flex flex-col justify-between p-2 font-black transition-all cursor-pointer shadow-lg border-2 select-none ${
                        isHeld
                          ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-black border-amber-200 -translate-y-2 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                          : 'bg-white hover:border-[#00f0ff] border-gray-300 hover:-translate-y-0.5'
                      } ${isRed ? 'text-rose-600' : 'text-slate-900'}`}
                    >
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span>{card.label}</span>
                        <span className="text-sm sm:text-base">{card.suit}</span>
                      </div>
                      <div className="text-center text-2xl sm:text-3xl font-bold">
                        {card.suit}
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className={isHeld ? 'text-amber-950 uppercase font-black tracking-wider' : 'text-gray-400'}>
                          {isHeld ? 'HOLD' : 'CAMBIAR'}
                        </span>
                        <span>{card.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-400 text-center">
                {pokerPhase === 'dealt'
                  ? '👆 Toca las cartas que quieras RESERVAR (HOLD). Las demás serán cambiadas por nuevas cartas de la baraja.'
                  : 'Mano lista. Presiona "REPARTIR NUEVA MANO" para jugar con baraja de póker tradicional.'}
              </div>

              {/* Mini Paytable Badges */}
              <div className="flex flex-wrap gap-1.5 justify-center text-[10px]">
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-amber-300">Esc. Real: 250x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-purple-300">Póker: 25x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-blue-300">Full: 9x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-emerald-300">Color: 6x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-teal-300">Escalera: 4x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-cyan-300">Trío: 3x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">Doble Par: 2x</span>
                <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400">Jotas+: 1.5x</span>
              </div>
            </div>

            {/* Action Buttons */}
            {pokerPhase === 'dealt' ? (
              <button
                onClick={drawPokerHand}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-sm uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:opacity-95 disabled:opacity-50"
              >
                {isProcessing ? 'CAMBIANDO CARTAS...' : 'DESCARTAR Y CAMBIAR CARTAS'}
              </button>
            ) : (
              <button
                onClick={startPokerGame}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-cyan-500 text-black font-black text-sm uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-95 disabled:opacity-50"
              >
                {isProcessing ? 'REPARTIENDO CARTAS...' : `REPARTIR NUEVA MANO (${betAmount} ${selectedToken})`}
              </button>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* GAME 4: EL SOLO CUBANO (BAZAS Y TRIUNFOS)            */}
        {/* ==================================================== */}
        {activeGame === 'solo_cubano' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                ♠️ El Solo Cubano (Juego Tradicional de Bazas y Triunfos)
              </span>
              <span className="text-teal-400">Ganas con Triunfo (2.2x)</span>
            </div>

            {/* Trump Selection */}
            <div className="flex items-center justify-between bg-[#020510] p-2.5 rounded-xl border border-gray-800 text-xs">
              <span className="text-gray-400">Palo de Triunfo Elegido:</span>
              <div className="flex gap-1.5">
                {(['Espadas', 'Oros', 'Copas', 'Bastos'] as const).map(suit => (
                  <button
                    key={suit}
                    onClick={() => {
                      setSoloTrumpSuit(suit);
                      playCyberSound('click');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      soloTrumpSuit === suit
                        ? 'bg-teal-500 text-black shadow-md'
                        : 'bg-gray-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {suit === 'Oros' ? '🟡 Oros' : suit === 'Copas' ? '🍷 Copas' : suit === 'Espadas' ? '⚔️ Espadas' : '🪵 Bastos'}
                  </button>
                ))}
              </div>
            </div>

            {/* Arena Comparison */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#020510] border border-teal-500/30">
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#050c1e] border border-gray-800">
                <span className="text-xs text-teal-400 font-bold mb-2">Tu Carta</span>
                {soloPlayerCard ? (
                  <div className="w-16 h-24 rounded-lg bg-amber-50 text-black border-2 border-teal-500 flex flex-col items-center justify-between p-1.5">
                    <span className="text-xs font-bold">{soloPlayerCard.label}</span>
                    <span className="text-lg">{soloPlayerCard.suit === 'Oros' ? '🟡' : soloPlayerCard.suit === 'Copas' ? '🍷' : soloPlayerCard.suit === 'Espadas' ? '⚔️' : '🪵'}</span>
                    <span className="text-[9px] font-bold">{soloPlayerCard.suit}</span>
                  </div>
                ) : (
                  <span className="text-gray-600 text-xs italic">Sin tirar</span>
                )}
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#050c1e] border border-gray-800">
                <span className="text-xs text-rose-400 font-bold mb-2">Carta Rival</span>
                {soloBotCard ? (
                  <div className="w-16 h-24 rounded-lg bg-amber-50 text-black border-2 border-rose-500 flex flex-col items-center justify-between p-1.5">
                    <span className="text-xs font-bold">{soloBotCard.label}</span>
                    <span className="text-lg">{soloBotCard.suit === 'Oros' ? '🟡' : soloBotCard.suit === 'Copas' ? '🍷' : soloBotCard.suit === 'Espadas' ? '⚔️' : '🪵'}</span>
                    <span className="text-[9px] font-bold">{soloBotCard.suit}</span>
                  </div>
                ) : (
                  <span className="text-gray-600 text-xs italic">Sin tirar</span>
                )}
              </div>
            </div>

            <button
              onClick={playSoloTrick}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-black font-black text-sm uppercase shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:opacity-95 disabled:opacity-50"
            >
              {isProcessing ? 'DISPUTANDO BAZA...' : `PEDIR "EL SOLO" CON ${soloTrumpSuit.toUpperCase()} (${betAmount} ${selectedToken})`}
            </button>
          </div>
        )}

        {/* Message / Status Feedback */}
        {gameMessage && (
          <div className="mt-4 p-2.5 rounded-lg bg-[#020510] border border-gray-800 text-xs text-center flex items-center justify-center gap-2">
            <span className={lastWin?.won ? 'text-emerald-400 font-bold' : 'text-gray-300'}>
              {gameMessage}
            </span>
          </div>
        )}

        {/* Provably Fair Badge */}
        <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Juegos Cubanos Tradicionales Provably Fair (SHA-256)
          </span>
          <span className="text-[#00f0ff]/80">Respaldo USDT BEP-20 (BNB Chain)</span>
        </div>
      </div>
    </div>
  );
};
