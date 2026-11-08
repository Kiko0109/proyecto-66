import React, { useState, useEffect, useRef } from 'react';
import {
  Skull,
  Radio,
  Wifi,
  Users,
  Shield,
  Crosshair,
  Lock,
  ChevronRight,
  Flame,
  User,
  Crown,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Eye,
  Sliders,
  Dna,
  Share2,
  ShieldAlert,
  Sword,
  Target,
  FileText,
  CloudRain,
  CloudLightning,
  Snowflake,
  Sun,
  Wind,
  Thermometer,
  Compass,
  Activity,
  Maximize2,
  Download,
  Copy,
  Check,
  Terminal,
  PlayCircle,
  Tent,
  MapPin
} from 'lucide-react';
import { playCyberSound } from '../utils/speechUtils';

type DeadLanViewMode = 'splash' | 'lobby' | 'character' | 'hierarchy' | 'bestiary' | 'weather' | 'mission' | 'camp' | 'apk_export';

type SeasonType = 'otoño' | 'invierno' | 'verano' | 'primavera';
type WeatherCondition = 'lluvia_torrencial' | 'tormenta_electrica' | 'ventisca_nieve' | 'ola_calor' | 'niebla_acida';

interface SubordinateNode {
  id: string;
  name: string;
  rank: 'Capitán' | 'Lugarteniente' | 'Sargento';
  specialty: 'Asalto' | 'Espionaje' | 'Ingeniería' | 'Logística';
  loyalty: number; // 0 - 100
  squadCount: number; // Subordinados bajo su mando
  squadRole: string;
  rationsAssigned: number;
  status: 'Activo' | 'En Misión de Infiltración' | 'Defendiendo Campamento' | 'Herido';
}

interface TacticalLog {
  id: string;
  text: string;
  type: 'info' | 'combat' | 'danger' | 'stealth';
  time: string;
}

export const DeadLanAppView: React.FC = () => {
  const [viewMode, setViewMode] = useState<DeadLanViewMode>('splash');
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStepText, setLoadStepText] = useState('Inicializando motor Vulkan Mobile PBR...');
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);

  // Weather & Seasons System State
  const [activeSeason, setActiveSeason] = useState<SeasonType>('otoño');
  const [activeWeather, setActiveWeather] = useState<WeatherCondition>('tormenta_electrica');
  const [isLightningActive, setIsLightningActive] = useState(false);
  const [ambientTemp, setAmbientTemp] = useState(14); // °C
  const [windSpeed, setWindSpeed] = useState(38); // km/h
  const [humidity, setHumidity] = useState(94); // %

  // LAN Lobby State
  const [lanMode, setLanMode] = useState<'host' | 'client'>('host');
  const [serverName, setServerName] = useState('Refugio C-9 // Comandante Max');
  const [hostIp, setHostIp] = useState('192.168.43.1');
  const [targetIp, setTargetIp] = useState('192.168.43.1');
  const [isScanning, setIsScanning] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState([
    { id: 'p1', name: 'Comandante Max (Host)', ping: '1 ms', status: 'Listo', role: 'Líder de Fuga' },
    { id: 'p2', name: 'Kiko_Táctico', ping: '4 ms', status: 'Listo', role: 'Ingeniero Recluso' },
    { id: 'p3', name: 'Operador_Sombra', ping: '3 ms', status: 'Esperando', role: 'Mendigo Explorador' }
  ]);
  const [gameDifficulty, setGameDifficulty] = useState<'supervivencia' | 'pesadilla' | 'brutal'>('pesadilla');

  // Character Customization State (Mendigo Recluso Inicial)
  const [characterConfig, setCharacterConfig] = useState({
    name: 'Max Prisionero #0109',
    gender: 'Hombre' as 'Hombre' | 'Mujer',
    skinTone: 'Curtido por sol' as 'Pálido' | 'Trigueño' | 'Moreno' | 'Oscuro' | 'Curtido por sol',
    faceShape: 'Curtido de Guerra' as 'Rudo' | 'Curtido de Guerra' | 'Afilado' | 'Marcial',
    hairStyle: 'Melena desaliñada de mendigo' as 'Rapado al cero' | 'Rapado con cicatriz' | 'Melena desaliñada de mendigo' | 'Pelo corto sucio',
    hairColor: 'Negro ceniza' as 'Negro ceniza' | 'Castaño oscuro' | 'Rubio sucio' | 'Canoso' | 'Pelirrojo quemado',
    scars: 'Cicatriz profunda en ojo y pómulo' as 'Ninguna' | 'Cicatriz profunda en ojo y pómulo' | 'Quemadura de alambre de espino' | 'Marcas de azotes de milicia',
    // Uniforme fijo: Ropa de mendigo
    outfit: 'Harapos de Mendigo y Recluso (Pantalón raído con remiendos, camiseta rota, trapos en tobillos)',
    startingWeapon: 'Tubo de hierro oxidado con codo reforzado'
  });

  // Hierarchy Module State (Pirámide de Mando Independiente)
  const [subordinates, setSubordinates] = useState<SubordinateNode[]>([
    {
      id: 'sub-1',
      name: 'Capitán Viktor "Tenaza"',
      rank: 'Capitán',
      specialty: 'Ingeniería',
      loyalty: 96,
      squadCount: 14,
      squadRole: 'Pelotón de Sabotaje de Vallas Eléctricas',
      rationsAssigned: 35,
      status: 'Activo'
    },
    {
      id: 'sub-2',
      name: 'Lugarteniente Vance',
      rank: 'Lugarteniente',
      specialty: 'Espionaje',
      loyalty: 88,
      squadCount: 8,
      squadRole: 'Célula de Infiltración Nocturna y Asesinatos',
      rationsAssigned: 20,
      status: 'En Misión de Infiltración'
    },
    {
      id: 'sub-3',
      name: 'Sargento "Gorila" Morales',
      rank: 'Sargento',
      specialty: 'Asalto',
      loyalty: 92,
      squadCount: 22,
      squadRole: 'Escuadra de Choque y Asalto Frontal',
      rationsAssigned: 50,
      status: 'Defendiendo Campamento'
    }
  ]);

  // Selected Monster in Bestiary
  const [selectedMonster, setSelectedMonster] = useState<number>(0);

  // In-app Tactical Notification Toast (Replaces window.alert for 100% compliance)
  const [tacticalToast, setTacticalToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warn' | 'info' | 'danger';
  } | null>(null);

  const showTacticalToast = (title: string, message: string, type: 'success' | 'warn' | 'info' | 'danger' = 'info') => {
    setTacticalToast({ title, message, type });
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        if (type === 'danger') navigator.vibrate([100, 50, 100]);
        else if (type === 'warn') navigator.vibrate([60, 40]);
        else navigator.vibrate(40);
      } catch {}
    }
    setTimeout(() => {
      setTacticalToast((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  };

  // Playable Mission Simulation State (La Gran Fuga: Celda C-9)
  const [missionHealth, setMissionHealth] = useState(85);
  const [missionNoise, setMissionNoise] = useState(15);
  const [missionProgress, setMissionProgress] = useState(20);
  const [guardAlertLevel, setGuardAlertLevel] = useState<'Normal' | 'Alerta' | '¡Alarma General!' | 'B.O.W. Suelto'>('Normal');
  const [missionLogs, setMissionLogs] = useState<TacticalLog[]>([
    {
      id: 'log-1',
      text: 'Encerrado en la celda C-9 con harapos de mendigo. La milicia patrulla el pasillo exterior.',
      type: 'info',
      time: '00:00'
    },
    {
      id: 'log-2',
      text: 'Has arrancado un tubo oxidado de la cañería rota bajo el camastro.',
      type: 'stealth',
      time: '00:01'
    }
  ]);
  const [escapeOutcome, setEscapeOutcome] = useState<'playing' | 'escaped' | 'captured'>('playing');

  // Godot Export Code Viewer State
  const [selectedApkFile, setSelectedApkFile] = useState<'project_godot' | 'network_manager' | 'android_manifest' | 'quick_start'>('project_godot');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Primer Campamento Refugio y Sistema de Asedios de las 25 Facciones
  const [campData, setCampData] = useState({
    name: 'Refugio Alfa: Bosque Negro',
    location: 'Bosque de Niebla y Pinos (Sector B-4)',
    fortificationLevel: 2,
    food: 80,
    water: 95,
    ammo: 40,
    scrap: 55,
    guardsAssigned: 12,
    smokeVisibility: 20, // % de humo visible
    stealthActive: false, // Apagar fogatas para no ser detectado
  });

  const [factionThreats, setFactionThreats] = useState<Array<{
    id: string;
    faction: string;
    type: 'asedio' | 'complot' | 'saqueo' | 'ataque_directo' | 'espionaje_asesinato';
    title: string;
    description: string;
    demands: string;
    reward: string;
    status: 'pendiente' | 'repelido' | 'aliado' | 'pagado' | 'evadido';
  }>>([
    {
      id: 'f-4',
      faction: 'Milicia Esclavista de Élite (Columna Pesada)',
      type: 'ataque_directo',
      title: '¡ATAQUE DIRECTO EN CURSO! Invasión Blindada y Fuego Masivo',
      description: '¡Sin peticiones ni treguas! 16 soldados de la Milicia en 2 camionetas blindadas con ametralladoras Browning pesadas embisten la valla este disparando ráfagas continuas hacia los barracones de tus subordinados.',
      demands: 'Destrucción total del campamento y captura de prisioneros',
      reward: 'Botín supremo: +40 balas, +35 chatarra y 1 camión artillado',
      status: 'pendiente'
    },
    {
      id: 'f-5',
      faction: 'Los Susurradores (Asesinos Furtivos)',
      type: 'espionaje_asesinato',
      title: 'Espías Infiltrados: Intento de Degollar al Comandante',
      description: 'Dos espías enemigos se cubrieron con harapos de mendigo fingiendo ser refugiados que escaparon de la celda C-10. Tus centinelas sospechan: llevan cuchillos de cerámica ocultos y buscan tu camastro para degollarte.',
      demands: 'Eliminación del líder y usurpar la frecuencia LAN',
      reward: '2 Cuchillos tácticos y mapa secreto de las bases de la Milicia',
      status: 'pendiente'
    },
    {
      id: 'f-1',
      faction: 'Milicia Esclavista de Élite',
      type: 'asedio',
      title: 'Ultimátum de Asedio por Humo de Fogatas',
      description: 'Han localizado las fogatas de tu campamento en el Sector B-4. Exigen 35 raciones de comida y que entregues a tu ingeniero Viktor antes del amanecer, o enviarán dos camionetas artilladas con ametralladoras pesadas a saquear vuestras tiendas.',
      demands: '35 raciones de comida',
      reward: 'Botín militar: +25 municiones y 1 camioneta blindada si los repeles',
      status: 'pendiente'
    },
    {
      id: 'f-2',
      faction: 'Los Conquistadores (Veteranos)',
      type: 'complot',
      title: 'Petición de Ataque Conjunto a Convoy Enemigo',
      description: 'Los Conquistadores te contactan por radio de onda corta: te piden enviar a tus soldados a emboscar el convoy de suministros de la Milicia en el puente roto. Si aceptas, compartirán el arsenal capturado.',
      demands: 'Apoyo táctico de 8 soldados en la emboscada',
      reward: '+50 cartuchos de escopeta, +30 botiquines y alianza militar',
      status: 'pendiente'
    },
    {
      id: 'f-3',
      faction: 'Los Desolladores Salvajes',
      type: 'saqueo',
      title: 'Infiltración Nocturna para Saquear Almacén',
      description: 'Tus centinelas escuchan ruidos en la alambrada sur. Una partida de 6 saqueadores con antorchas y ganzúas intenta forzar la bodega de agua y víveres del campamento.',
      demands: 'Intentan robar 30 de comida y 20 de agua',
      reward: 'Chatarra +30 y 2 prisioneros para interrogatorio',
      status: 'pendiente'
    }
  ]);

  const [campRadioLogs, setCampRadioLogs] = useState<string[]>([
    'Campamento Alfa establecido con éxito tras la fuga de la prisión C-9.',
    '⚠️ Facciones en alerta: Tu firma de humo ha sido captada por la Milicia y Los Desolladores.',
    'Capitán Viktor reforzó la puerta principal con vigas de roble y alambre de espino.'
  ]);

  // Weather definition database
  const WEATHER_PRESETS: Record<WeatherCondition, {
    label: string;
    season: SeasonType;
    temp: number;
    wind: number;
    humidity: number;
    icon: any;
    visualEffect: string;
    aiImpact: string;
    playerImpact: string;
  }> = {
    tormenta_electrica: {
      label: 'Tormenta Eléctrica y Lluvia Torrencial',
      season: 'otoño',
      temp: 14,
      wind: 48,
      humidity: 98,
      icon: CloudLightning,
      visualEffect: 'Relámpagos estroboscópicos, aguacero denso y niebla baja.',
      aiImpact: '⚡ Los truenos ensordecen a los zombis y anulan el súper-oído del Licker. La lluvia lava tu rastro olfativo.',
      playerImpact: 'El barro ralentiza tu velocidad un 15%; charcos de agua transmiten descargas de vallas caídas.'
    },
    lluvia_torrencial: {
      label: 'Lluvia Torrencial de Otoño',
      season: 'otoño',
      temp: 16,
      wind: 32,
      humidity: 92,
      icon: CloudRain,
      visualEffect: 'Gotas de lluvia continuas con sonido de goteo en láminas metálicas.',
      aiImpact: '🌧️ Visibilidad de patrullas militares reducida a 25 metros. Zombis son más lentos en cruzar ríos.',
      playerImpact: 'Las antorchas y fogatas se apagan si están al aire libre.'
    },
    ventisca_nieve: {
      label: 'Ventisca Ártica y Nieve Extrema',
      season: 'invierno',
      temp: -12,
      wind: 55,
      humidity: 45,
      icon: Snowflake,
      visualEffect: 'Copos de nieve congelados en ráfagas rápidas y escarcha en los bordes.',
      aiImpact: '❄️ Las patrullas militares rastrean tus huellas en la nieve. Los zombis se mueven 30% más lentos por congelación articular.',
      playerImpact: 'Riesgo de hipotermia grave si no te cobijas en interiores con fuego cada 10 minutos.'
    },
    ola_calor: {
      label: 'Ola de Calor Tóxico y Sequía',
      season: 'verano',
      temp: 41,
      wind: 15,
      humidity: 18,
      icon: Sun,
      visualEffect: 'Ondulaciones de distorsión térmica, polvo seco en suspensión y sol abrasador.',
      aiImpact: '🔥 Zombis en estado de frenesí hiper-agresivo al mediodía; mayor rango de visión de francotiradores.',
      playerImpact: 'Consumo de agua triplicado. Si te quedas sin raciones líquidas pierdes resistencia al correr.'
    },
    niebla_acida: {
      label: 'Primavera Radioactiva (Lluvia Ácida)',
      season: 'primavera',
      temp: 21,
      wind: 20,
      humidity: 85,
      icon: Wind,
      visualEffect: 'Niebla verdosa densa que flota a ras de suelo con partículas corrosivas.',
      aiImpact: '☣️ Reduce la visión de todas las facciones y zombis a solo 8 metros (ideal para espías y sigilo extremo).',
      playerImpact: 'Desgaste progresivo de salud si no usas una máscara improvisada o te cubres bajo techos.'
    }
  };

  const BESTIARY = [
    {
      name: 'Licker Bio-Mutante (Experimento C-102)',
      danger: 'EXTREMO',
      lore: 'Aberración bio-orgánica ciega con tejido muscular y cerebro expuestos. Sus cuerdas auditivas detectan pisadas y disparos a 40 metros. Si escucha un sonido, trepa por paredes y techos lanzando su lengua punzante con fuerza letal.',
      weakness: 'Disparos en cerebro expuesto o uso de silenciadores y trampas de sonido distractoras.',
      audioReaction: 'Detecta carreras y recargas de munición. Ignora el movimiento en sigilo agachado.',
      mutationLevel: 'Nivel 4 (B.O.W. Avanzado)'
    },
    {
      name: 'Tyrant Titán-66 (Super Soldado B.O.W.)',
      danger: 'CATASTRÓFICO',
      lore: 'Mutante humanoide de 2.80m dotado de regeneración celular acelerada y blindaje subcutáneo. Puede embestir barricadas de madera y puertas blindadas de prisiones sin sufrir aturdimiento.',
      weakness: 'Lanzacohetes pesados antiaéreos, minas de termita o concentrar fuego conjunto en su pericardio expuesto.',
      audioReaction: 'Persigue de forma implacable el fuego cruzado prolongado de combates entre facciones.',
      mutationLevel: 'Nivel 5 (Líder Biológico)'
    },
    {
      name: 'Rastreador Cuadrúpedo de Fosa',
      danger: 'ALTO',
      lore: 'Experimento genético cuadrúpedo que mora en los sótanos y alcantarillados de la prisión. Emite gemidos agudos para alertar a los zombis cercanos y ataca saltando al cuello desde conductos de ventilación.',
      weakness: 'Disparar a sus patas delanteras lo incapacita para saltar, obligándolo a arrastrarse.',
      audioReaction: 'Atraído por el eco dentro de edificios cerrados y túneles húmedos.',
      mutationLevel: 'Nivel 3 (Depredador Subterráneo)'
    },
    {
      name: 'Hordas Desmembrables con Daño Localizado',
      danger: 'MEDIO - ABRUMADOR EN MASA',
      lore: 'Infectados urbanos que vagan en grandes grupos por el mapa de 10,000 km². Cuentan con físicas de impacto balístico: si les disparas a las piernas caen y gatean hacia ti; si disparas a los brazos pierden capacidad de agarre.',
      weakness: 'Disparos precisos al cráneo o minas de fragmentación para amputar extremidades inferiores.',
      audioReaction: 'Cualquier disparo sin silenciador en un radio de 100 metros activa a toda la horda.',
      mutationLevel: 'Nivel 1 (Vector de Infección)'
    }
  ];

  // Random Lightning Flash Effect for Atmospheric Immersion
  useEffect(() => {
    if (activeWeather !== 'tormenta_electrica') return;

    const lightningInterval = setInterval(() => {
      // 30% chance every 4 seconds to trigger a double lightning strike
      if (Math.random() < 0.45) {
        setIsLightningActive(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate([40, 60, 80]); } catch {}
        }
        setTimeout(() => setIsLightningActive(false), 90);
        setTimeout(() => {
          setIsLightningActive(true);
          setTimeout(() => setIsLightningActive(false), 60);
        }, 150);
      }
    }, 4500);

    return () => clearInterval(lightningInterval);
  }, [activeWeather]);

  // Loading Progress Animation
  useEffect(() => {
    if (viewMode !== 'splash') return;

    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReadyToEnter(true);
          return 100;
        }
        const next = prev + 5;
        if (next < 20) setLoadStepText('Iniciando motor Vulkan Mobile PBR (Android 14+)...');
        else if (next < 40) setLoadStepText('Compilando ciclo climático de 4 estaciones y niebla volumétrica...');
        else if (next < 60) setLoadStepText('Sincronizando IA enemiga acústica y aberraciones B.O.W....');
        else if (next < 80) setLoadStepText('Escaneando adaptadores Wi-Fi Hotspot LAN P2P (Sin Internet)...');
        else if (next < 95) setLoadStepText('Cargando prisión C-9 y vestimenta de mendigo recluso...');
        else setLoadStepText('¡SISTEMA TÁCTICO DEAD LAN LISTO!');
        return next;
      });
    }, 65);

    return () => clearInterval(interval);
  }, [viewMode]);

  // Change weather and season helper
  const handleSelectWeather = (w: WeatherCondition) => {
    playCyberSound('switch');
    setActiveWeather(w);
    const preset = WEATHER_PRESETS[w];
    setActiveSeason(preset.season);
    setAmbientTemp(preset.temp);
    setWindSpeed(preset.wind);
    setHumidity(preset.humidity);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#02050c] text-white select-none font-sans relative overflow-x-hidden">
      {/* CAPA DE EFECTOS AMBIENTALES GLOBALES (LLUVIA, NIEVE, RELÁMPAGOS, NIEBLA) */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {/* Flash de relámpago estroboscópico */}
        <div
          className={`absolute inset-0 bg-white/25 transition-opacity duration-75 ${
            isLightningActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Lluvia animada con gotas inclinadas por el viento */}
        {(activeWeather === 'tormenta_electrica' || activeWeather === 'lluvia_torrencial') && (
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,0,0,0.4)_100%)]">
            <div className="rain-canvas w-full h-full" />
          </div>
        )}

        {/* Nieve animada si está en invierno */}
        {activeWeather === 'ventisca_nieve' && (
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] animate-pulse" />
        )}

        {/* Niebla densa baja */}
        {(activeWeather === 'niebla_acida' || activeWeather === 'tormenta_electrica') && (
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-emerald-950/20 via-cyan-950/15 to-transparent blur-2xl" />
        )}
      </div>

      {/* PANTALLA 1: PORTADA CINEMÁTICA ANIMADA CON BARRA DE CARGA */}
      {viewMode === 'splash' && (
        <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black touch-manipulation">
          {/* Cover Art Background con respiración animada */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 animate-pulse"
            style={{
              backgroundImage: `url('/assets/images/dead_lan_cover.jpg')`,
              animationDuration: '6s'
            }}
          />

          {/* Soft Edge Gradient - Center and top stay completely clean and visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050c]/95 via-transparent to-black/20 pointer-events-none" />

          {/* Foco de Torre de Vigilancia oscilando */}
          <div className="absolute -top-10 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl transform rotate-45 animate-pulse pointer-events-none" />

          {/* Espacio Superior y Central Completamente Limpio (Sin insignias ni textos sobre el arte) */}
          <div className="flex-1" />

          {/* Bottom Loading Bar Container para Móvil */}
          <div className="relative z-10 p-5 sm:p-6 max-w-xl mx-auto w-full space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold flex items-center gap-2 truncate max-w-[80%]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                <span className="truncate">{loadStepText}</span>
              </span>
              <span className="text-white font-bold">{loadProgress}%</span>
            </div>

            {/* Tactical High-Tech Progress Bar */}
            <div className="h-3 w-full bg-black/80 rounded-full border border-red-500/40 p-0.5 overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                style={{ width: `${loadProgress}%` }}
              />
            </div>

            {/* Enter Button Grande y Cómodo para Pulgar Móvil */}
            <div className="pt-1">
              <button
                disabled={!isReadyToEnter}
                onClick={() => {
                  playCyberSound('approve');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    try { navigator.vibrate(50); } catch {}
                  }
                  setViewMode('lobby');
                }}
                className={`w-full py-4 rounded-2xl font-mono font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl active:scale-95 ${
                  isReadyToEnter
                    ? 'bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white hover:brightness-110 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                    : 'bg-gray-900 text-gray-500 border border-gray-800 cursor-not-allowed opacity-60'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isReadyToEnter ? 'ENTRAR AL LOBBY TÁCTICO LAN' : 'COMPILANDO RECURSOS...'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CABECERA DE NAVEGACIÓN ENTRE MÓDULOS DE DEAD LAN */}
      {viewMode !== 'splash' && (
        <div className="bg-[#050c1e] border-b border-red-500/30 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xl sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-950 border border-red-500/50 flex items-center justify-center">
              <Skull className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-white tracking-widest">DEAD LAN // VULKAN 3D</h2>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {WEATHER_PRESETS[activeWeather].label.split(' ')[0]} ({ambientTemp}°C)
              </span>
            </div>
          </div>

          {/* Navigation Tabs Optimizadas para Móvil */}
          <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto max-w-full pb-0.5">
            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('lobby');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'lobby'
                  ? 'bg-red-600 text-white font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Lobby LAN</span>
            </button>

            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('weather');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'weather'
                  ? 'bg-amber-600 text-white font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <CloudLightning className="w-3.5 h-3.5 text-amber-300" />
              <span>Clima & IA</span>
            </button>

            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('character');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'character'
                  ? 'bg-stone-700 text-white font-bold shadow-[0_0_10px_rgba(168,162,158,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mendigo</span>
            </button>

            {/* Módulo Independiente de Jerarquía (No va junto con el editor) */}
            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('hierarchy');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'hierarchy'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Jerarquía</span>
            </button>

            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('bestiary');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'bestiary'
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(147,51,234,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>B.O.W.</span>
            </button>

            {/* Misión Táctica de la Gran Fuga Celda C-9 */}
            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('mission');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'mission'
                  ? 'bg-emerald-600 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5 text-emerald-300" />
              <span>Misión: Fuga C-9</span>
            </button>

            {/* Primer Campamento Refugio & Sistema de Asedios de las 25 Facciones */}
            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('camp');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'camp'
                  ? 'bg-amber-600 text-white font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Tent className="w-3.5 h-3.5 text-amber-300" />
              <span>Campamento & Asedios</span>
            </button>

            {/* Generador y Exportador de APK para Android */}
            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('apk_export');
              }}
              className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                viewMode === 'apk_export'
                  ? 'bg-cyan-600 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span>Exportar APK</span>
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICACIÓN TÁCTICA HUD EN PANTALLA (REEMPLAZO DE WINDOW.ALERT) */}
      {tacticalToast && (
        <div className="fixed top-14 inset-x-3 sm:inset-x-auto sm:right-4 z-50 max-w-sm sm:max-w-md mx-auto sm:mx-0 p-3.5 rounded-2xl bg-black/95 border border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.5)] backdrop-blur-md flex items-start gap-3 animate-bounce-short font-mono text-xs text-white">
          <div className={`p-2 rounded-xl shrink-0 ${
            tacticalToast.type === 'danger' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
            tacticalToast.type === 'warn' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
            tacticalToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
            'bg-blue-500/20 text-cyan-400 border border-blue-500/40'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">{tacticalToast.title}</h4>
            <p className="text-[11px] text-gray-300 leading-snug mt-0.5">{tacticalToast.message}</p>
          </div>
          <button
            onClick={() => setTacticalToast(null)}
            className="text-gray-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* PANTALLA 2: LOBBY PRINCIPAL LAN (ANIMADO CON CLIMA Y RADAR) */}
      {viewMode === 'lobby' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          {/* Header Banner con Clima Actual en Vivo */}
          <div className="bg-gradient-to-r from-red-950/80 via-[#050c1e] to-black p-4 rounded-2xl border border-red-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl relative overflow-hidden">
            {/* Animación de escáner en el fondo */}
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                  SALA DE OPERACIONES LAN P2P
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CloudLightning className="w-3 h-3 text-amber-400" />
                  {WEATHER_PRESETS[activeWeather].season.toUpperCase()} // {ambientTemp}°C
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-white">Lobby de Supervivencia Cooperativa LAN</h2>
              <p className="text-xs text-gray-300">
                Conexión por <strong className="text-emerald-400">Punto de Acceso Wi-Fi / Hotspot</strong>. Sin internet ni consumo de saldo.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <button
                onClick={() => setViewMode('weather')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Cambiar Clima</span>
              </button>
            </div>
          </div>

          {/* Toggle Host / Client para Móvil */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#030712] border border-gray-800 max-w-md mx-auto">
            <button
              onClick={() => {
                playCyberSound('click');
                setLanMode('host');
              }}
              className={`py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                lanMode === 'host'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>1. Crear Partida (Host)</span>
            </button>
            <button
              onClick={() => {
                playCyberSound('click');
                setLanMode('client');
              }}
              className={`py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                lanMode === 'client'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>2. Unirse por IP</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Panel de Configuración de Red */}
            <div className="lg:col-span-2 bg-[#050c1e] p-5 rounded-2xl border border-gray-800 space-y-4 shadow-xl">
              {lanMode === 'host' ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <h3 className="font-mono text-sm font-bold text-red-400 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-500" />
                      PARÁMETROS DEL SERVIDOR LOCAL
                    </h3>
                    <span className="text-[11px] font-mono text-gray-400">Puerto: 7777 (UDP)</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">Nombre de la Sala LAN:</label>
                      <input
                        type="text"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-red-500/40 text-white focus:outline-none focus:border-red-400 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 mb-1">IP Local del Dispositivo (Tu Hotspot):</label>
                        <input
                          type="text"
                          value={hostIp}
                          onChange={(e) => setHostIp(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gray-700 text-emerald-400 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Dificultad de la Horda:</label>
                        <select
                          value={gameDifficulty}
                          onChange={(e) => setGameDifficulty(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gray-700 text-white focus:outline-none"
                        >
                          <option value="supervivencia">Supervivencia Táctica (Media)</option>
                          <option value="pesadilla">Pesadilla B.O.W. (Alta - Zombis reactivos)</option>
                          <option value="brutal">Brutal 10,000 km² (Sin regeneración)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-[11px] text-gray-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Instrucción para tus compañeros en móvil:</span>
                      </div>
                      <p>Diles que se conecten a tu Zona Wi-Fi y coloquen la IP <strong>{hostIp}</strong> en su pantalla de unirse.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playCyberSound('approve');
                      showTacticalToast(
                        'SERVIDOR LAN HOST INICIADO',
                        `Sala activa en ${hostIp}:7777 (${serverName}). Transfiriendo a la Celda C-9...`,
                        'success'
                      );
                      setTimeout(() => setViewMode('mission'), 800);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>INICIAR PARTIDA COOPERATIVA LAN</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <h3 className="font-mono text-sm font-bold text-blue-400 flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-blue-500" />
                      UNIRSE A PARTIDA LOCAL
                    </h3>
                    <span className="text-[11px] font-mono text-gray-400">Escanear Subred</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">IP del Teléfono Host (El que creó la sala):</label>
                      <input
                        type="text"
                        value={targetIp}
                        onChange={(e) => setTargetIp(e.target.value)}
                        placeholder="192.168.43.1"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-blue-500/40 text-cyan-300 focus:outline-none focus:border-blue-400 font-bold text-sm tracking-wider"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setIsScanning(true);
                        playCyberSound('receive');
                        setTimeout(() => {
                          setIsScanning(false);
                          playCyberSound('approve');
                          showTacticalToast('ESCÁNER LAN COMPLETADO', `Encontrado 1 servidor: ${serverName} (${targetIp}:7777)`, 'info');
                        }, 1000);
                      }}
                      className="w-full py-3 rounded-xl bg-blue-950/60 border border-blue-500/50 hover:bg-blue-900/60 text-blue-300 font-bold transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                      <span>{isScanning ? 'Escaneando paquetes en la red local...' : 'Escanear Partidas en el Wi-Fi'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      playCyberSound('approve');
                      showTacticalToast(
                        'CONEXIÓN LAN P2P EXITOSA',
                        `Sincronizado con Host ${targetIp}:7777. Cargando sector Celda C-9...`,
                        'success'
                      );
                      setTimeout(() => setViewMode('mission'), 800);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4" />
                    <span>CONECTAR AL HOST LAN</span>
                  </button>
                </>
              )}
            </div>

            {/* Lista de Supervivientes Conectados en LAN */}
            <div className="bg-[#050c1e] p-5 rounded-2xl border border-gray-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <h3 className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  SUPERVIVIENTES EN SALA ({connectedPlayers.length}/8)
                </h3>
              </div>

              <div className="space-y-2">
                {connectedPlayers.map((player) => (
                  <div key={player.id} className="p-2.5 rounded-xl bg-black/50 border border-gray-800 flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {player.name}
                      </div>
                      <div className="text-[10px] text-gray-400">{player.role}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 font-bold block">{player.ping}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">{player.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-2">
                <button
                  onClick={() => {
                    playCyberSound('click');
                    setViewMode('character');
                  }}
                  className="w-full py-3 rounded-xl bg-stone-700/40 hover:bg-stone-700/60 text-stone-200 border border-stone-600/50 font-mono text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personalizar mi Mendigo</span>
                </button>

                <button
                  onClick={() => {
                    playCyberSound('click');
                    setViewMode('weather');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <CloudLightning className="w-3.5 h-3.5" />
                  <span>Ver Efecto de Clima en IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA: CLIMA, ESTACIONES Y SU IMPACTO EN LA IA ENEMIGA */}
      {viewMode === 'weather' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-950/80 via-[#050c1e] to-black p-4 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                MOTOR AMBIENTAL DINÁMICO • 4 ESTACIONES Y REACCIÓN DE IA
              </span>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-amber-400" />
                Efectos de Clima, Estaciones e IA Enemiga
              </h2>
              <p className="text-xs text-gray-300">
                El clima altera físicamente el comportamiento de los zombis, los Lickers y las 25 facciones.
              </p>
            </div>
            <button
              onClick={() => {
                playCyberSound('click');
                setViewMode('lobby');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition"
            >
              ✓ Aplicar y Volver al Lobby
            </button>
          </div>

          {/* Telemetría Atmosférica en Tiempo Real */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block">ESTACIÓN ACTUAL:</span>
                <span className="text-amber-400 font-bold uppercase">{activeSeason}</span>
              </div>
              <Compass className="w-4 h-4 text-amber-400" />
            </div>

            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block">TEMPERATURA:</span>
                <span className={`font-bold ${ambientTemp < 0 ? 'text-cyan-400' : ambientTemp > 35 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {ambientTemp} °C
                </span>
              </div>
              <Thermometer className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block">VIENTO SECTORIAL:</span>
                <span className="text-white font-bold">{windSpeed} km/h</span>
              </div>
              <Wind className="w-4 h-4 text-gray-400" />
            </div>

            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block">HUMEDAD AMBIENTAL:</span>
                <span className="text-blue-400 font-bold">{humidity} %</span>
              </div>
              <CloudRain className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          {/* Selector de Climas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(WEATHER_PRESETS) as WeatherCondition[]).map((condKey) => {
              const preset = WEATHER_PRESETS[condKey];
              const isSelected = activeWeather === condKey;
              const IconComp = preset.icon;

              return (
                <div
                  key={condKey}
                  onClick={() => handleSelectWeather(condKey)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between space-y-3 font-mono text-xs ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : 'bg-[#050c1e] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                        isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-black/60 border-gray-800 text-gray-400'
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase">{preset.season}</span>
                        <h4 className="font-bold text-white text-xs">{preset.label.split(' ')[0]} {preset.label.split(' ')[1] || ''}</h4>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        ACTIVO
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                    {preset.visualEffect}
                  </p>

                  <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800 space-y-1">
                    <span className="text-amber-400 font-bold text-[10px] block">REACCIÓN DE LA IA:</span>
                    <p className="text-[10px] text-gray-300 font-sans leading-tight">{preset.aiImpact}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panel Explicativo Detallado del Clima Activo sobre la IA */}
          <div className="bg-[#050c1e] p-5 rounded-2xl border border-gray-800 space-y-3 shadow-xl font-mono text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-gray-800">
              <Activity className="w-4 h-4 text-emerald-400" />
              SISTEMA DE COMPORTAMIENTO DE IA BAJO ESTE CLIMA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300 font-sans">
              <div className="p-3.5 rounded-xl bg-black/50 border border-gray-800 space-y-1.5">
                <strong className="text-amber-400 font-mono text-xs block">Impacto en Criaturas B.O.W. y Zombis:</strong>
                <p className="text-[11px] leading-relaxed">
                  {WEATHER_PRESETS[activeWeather].aiImpact}
                </p>
                <div className="text-[10px] text-gray-400 pt-1 font-mono">
                  • Oído del Licker: {activeWeather === 'tormenta_electrica' ? 'DESACTIVADO POR TRUENOS' : 'ALTA SENSIBILIDAD (40m)'}
                  <br />
                  • Velocidad de horda: {activeWeather === 'ventisca_nieve' ? 'RALENTIZADA -30%' : activeWeather === 'ola_calor' ? 'FRENESÍ +20%' : 'NORMAL'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-gray-800 space-y-1.5">
                <strong className="text-cyan-400 font-mono text-xs block">Impacto en el Superviviente Mendigo:</strong>
                <p className="text-[11px] leading-relaxed">
                  {WEATHER_PRESETS[activeWeather].playerImpact}
                </p>
                <div className="text-[10px] text-gray-400 pt-1 font-mono">
                  • Huellas en el suelo: {activeWeather === 'ventisca_nieve' ? 'RASTREABLES POR PATRULLAS' : 'INVISIBLES'}
                  <br />
                  • Visibilidad táctica: {activeWeather === 'niebla_acida' ? 'EXTREMA (8m)' : 'DESPEJADA (80m)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA 3: EDITOR DE PERSONAJE (ROPA DE MENDIGO INICIAL) */}
      {viewMode === 'character' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          <div className="bg-gradient-to-r from-stone-900/80 via-[#050c1e] to-black p-4 rounded-2xl border border-stone-600/40 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold">
                FICHA DE IDENTIDAD • PRISIÓN SECTOR C-9
              </span>
              <h2 className="text-xl font-bold font-mono text-white">Editor de Personaje Recluso</h2>
              <p className="text-xs text-gray-300">
                Inicias como prisionero desarmado. Tu uniforme obligatorio son los harapos de mendigo.
              </p>
            </div>
            <button
              onClick={() => {
                playCyberSound('approve');
                setViewMode('lobby');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition"
            >
              ✓ Guardar y Volver al Lobby
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Opciones de Personalización Optimizadas para Móvil */}
            <div className="lg:col-span-2 bg-[#050c1e] p-5 rounded-2xl border border-gray-800 space-y-4 shadow-xl font-mono text-xs">
              {/* Nombre y Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Nombre / Alias del Superviviente:</label>
                  <input
                    type="text"
                    value={characterConfig.name}
                    onChange={(e) => setCharacterConfig({ ...characterConfig, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Sexo Biológico:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Hombre', 'Mujer'] as const).map((gender) => (
                      <button
                        key={gender}
                        onClick={() => {
                          playCyberSound('click');
                          setCharacterConfig({ ...characterConfig, gender });
                        }}
                        className={`py-2.5 rounded-xl font-bold border transition ${
                          characterConfig.gender === gender
                            ? 'bg-amber-600 text-white border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : 'bg-black/40 text-gray-400 border-gray-800'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tono de piel */}
              <div>
                <label className="block text-gray-400 mb-1.5">Tono de Piel y Tez:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Pálido', 'Trigueño', 'Moreno', 'Oscuro', 'Curtido por sol'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => {
                        playCyberSound('click');
                        setCharacterConfig({ ...characterConfig, skinTone: tone });
                      }}
                      className={`py-2.5 px-2.5 rounded-xl border text-center transition ${
                        characterConfig.skinTone === tone
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                          : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rostro y Estructura */}
              <div>
                <label className="block text-gray-400 mb-1.5">Estructura Facial:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Rudo', 'Curtido de Guerra', 'Afilado', 'Marcial'] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => {
                        playCyberSound('click');
                        setCharacterConfig({ ...characterConfig, faceShape: shape });
                      }}
                      className={`py-2.5 px-2 rounded-xl border text-center transition ${
                        characterConfig.faceShape === shape
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                          : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pelo y Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Corte de Cabello:</label>
                  <select
                    value={characterConfig.hairStyle}
                    onChange={(e) => setCharacterConfig({ ...characterConfig, hairStyle: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white focus:outline-none"
                  >
                    <option value="Melena desaliñada de mendigo">Melena desaliñada de mendigo</option>
                    <option value="Rapado al cero">Rapado al cero carcelario</option>
                    <option value="Rapado con cicatriz">Rapado con cicatriz lateral</option>
                    <option value="Pelo corto sucio">Pelo corto revuelto sucio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Color de Pelo:</label>
                  <select
                    value={characterConfig.hairColor}
                    onChange={(e) => setCharacterConfig({ ...characterConfig, hairColor: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white focus:outline-none"
                  >
                    <option value="Negro ceniza">Negro ceniza</option>
                    <option value="Castaño oscuro">Castaño oscuro</option>
                    <option value="Rubio sucio">Rubio sucio</option>
                    <option value="Canoso">Canoso / Plateado</option>
                    <option value="Pelirrojo quemado">Pelirrojo quemado</option>
                  </select>
                </div>
              </div>

              {/* Cicatrices y Suciedad */}
              <div>
                <label className="block text-gray-400 mb-1">Marcas de Guerra y Cicatrices:</label>
                <select
                  value={characterConfig.scars}
                  onChange={(e) => setCharacterConfig({ ...characterConfig, scars: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white focus:outline-none"
                >
                  <option value="Cicatriz profunda en ojo y pómulo">Cicatriz profunda en ojo y pómulo</option>
                  <option value="Quemadura de alambre de espino">Quemadura de alambre de espino</option>
                  <option value="Marcas de azotes de milicia">Marcas de azotes de milicia esclavista</option>
                  <option value="Ninguna">Piel limpia sin cicatrices</option>
                </select>
              </div>

              {/* VESTIMENTA FIJA OBLIGATORIA: MENDIGO */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>UNIFORME FIJO: HARAPOS DE MENDIGO / RECLUSO</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                  No se permite elegir uniformes militares en la creación. Comienzas con un pantalón desgastado con parches, camiseta rota manchada de hollín, vendas en muñecas y descalzo.
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-amber-500/20">
                  <span>Arma Inicial: {characterConfig.startingWeapon}</span>
                  <span className="text-emerald-400">Protección Balística: 0%</span>
                </div>
              </div>
            </div>

            {/* Vista Previa de la Ficha del Recluso */}
            <div className="bg-[#050c1e] p-5 rounded-2xl border border-gray-800 space-y-4 shadow-xl font-mono text-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="pb-3 border-b border-gray-800 text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-700 via-stone-800 to-black border-2 border-amber-500/50 flex items-center justify-center text-3xl shadow-lg mb-2">
                    {characterConfig.gender === 'Hombre' ? '🧔' : '👩'}
                  </div>
                  <h3 className="font-bold text-white text-sm">{characterConfig.name}</h3>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    {characterConfig.gender} • {characterConfig.skinTone}
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-gray-800">
                    <span className="text-gray-400">Rostro:</span>
                    <span className="text-white font-bold">{characterConfig.faceShape}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-gray-800">
                    <span className="text-gray-400">Pelo:</span>
                    <span className="text-white font-bold truncate max-w-[130px]">{characterConfig.hairStyle}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-gray-800">
                    <span className="text-gray-400">Color:</span>
                    <span className="text-white font-bold">{characterConfig.hairColor}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/40 border border-gray-800">
                    <span className="text-gray-400">Cicatrices:</span>
                    <span className="text-amber-400 font-bold truncate max-w-[130px]">{characterConfig.scars}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-[10px] text-red-300">
                    <strong>Condición Física:</strong> Desnutrido y magullado tras 3 semanas en aislamiento.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  playCyberSound('approve');
                  setViewMode('lobby');
                }}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95"
              >
                Confirmar Superviviente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA 4: MÓDULO INDEPENDIENTE DE JERARQUÍA PIRAMIDAL */}
      {viewMode === 'hierarchy' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950/80 via-[#050c1e] to-black p-4 rounded-2xl border border-blue-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                SISTEMA DE MANDO PIRAMIDAL • PROYECTO DEAD LAN
              </span>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Cadena de Mando de tus Subordinados
              </h2>
              <p className="text-xs text-gray-300">
                Tú eres el Comandante Supremo. Tus capitanes comandan a sus propios pelotones en el mapa.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-blue-950 border border-blue-500/50 text-blue-300 font-bold">
                44 Tropas Totales
              </span>
            </div>
          </div>

          {/* Pirámide Visual de Mando */}
          <div className="bg-[#050c1e] p-5 rounded-2xl border border-gray-800 space-y-5 shadow-xl">
            {/* Cúspide: Comandante Supremo (Tú) */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-600/20 via-[#0a1530] to-amber-600/20 border-2 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)] text-center space-y-1 font-mono">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl">
                👑
              </div>
              <h3 className="font-black text-white text-base">COMANDANTE SUPREMO (TÚ)</h3>
              <p className="text-[11px] text-amber-300">Control Central de Facciones • Asignación de Raciones y Campamentos</p>
            </div>

            {/* Conectores hacia Capitanes */}
            <div className="text-center text-blue-400 font-mono text-xs font-bold tracking-widest">
              ↓ ÓRDENES DIRECTAS A TUS LUGARTENIENTES ↓
            </div>

            {/* Nivel 2: Tus Subordinados Directos (Capitanes) y sus Subordinados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subordinates.map((sub) => (
                <div key={sub.id} className="p-4 rounded-2xl bg-black/60 border border-blue-500/30 hover:border-blue-400 transition space-y-3 font-mono text-xs flex flex-col justify-between shadow-lg">
                  <div>
                    {/* Header del Capitán */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
                          {sub.rank} // {sub.specialty}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{sub.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400">Lealtad:</span>
                        <span className="text-emerald-400 font-bold block">{sub.loyalty}%</span>
                      </div>
                    </div>

                    {/* Pelotón Subordinado (Los que están bajo su mando) */}
                    <div className="mt-3 p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Tropas bajo su mando:</span>
                        <span className="text-white font-bold">{sub.squadCount} soldados</span>
                      </div>
                      <p className="text-[10px] text-cyan-300 leading-tight">
                        {sub.squadRole}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-800">
                        <span>Raciones Diarias:</span>
                        <span className="text-amber-400 font-bold">{sub.rationsAssigned} comida</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado y Acciones de Mando */}
                  <div className="space-y-2 pt-2 border-t border-gray-800">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-400">Estado:</span>
                      <span className="text-emerald-400 font-bold">{sub.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          playCyberSound('approve');
                          showTacticalToast(
                            'DESPLIEGUE TÁCTICO ORDENADO',
                            `Pelotón de ${sub.name} (${sub.squadCount} soldados) movilizado al perímetro exterior.`,
                            'info'
                          );
                        }}
                        className="py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-[10px] font-bold transition active:scale-95"
                      >
                        Desplegar Pelotón
                      </button>
                      <button
                        onClick={() => {
                          playCyberSound('receive');
                          setSubordinates(
                            subordinates.map((s) => (s.id === sub.id ? { ...s, rationsAssigned: s.rationsAssigned + 10 } : s))
                          );
                        }}
                        className="py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition active:scale-95"
                      >
                        +10 Raciones
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA 5: BESTIARIO DE ABERRACIONES BIO-ORGÁNICAS (RESIDENT EVIL B.O.W.) */}
      {viewMode === 'bestiary' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          <div className="bg-gradient-to-r from-purple-950/80 via-[#050c1e] to-black p-4 rounded-2xl border border-purple-500/40 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                REGISTRO BIOLÓGICO CLASIFICADO • EXPERIMENTOS RESIDENT EVIL
              </span>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <Dna className="w-5 h-5 text-purple-400" />
                Criaturas Mutantes & B.O.W. de Laboratorio
              </h2>
              <p className="text-xs text-gray-300">
                Experimentos fallidos que acechan en la oscuridad de los 10,000 km².
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Lista de Criaturas Optimizada para Móvil */}
            <div className="bg-[#050c1e] p-4 rounded-2xl border border-gray-800 space-y-2 shadow-xl font-mono text-xs">
              <span className="text-gray-400 font-bold block mb-2 tracking-wider">ESPECIES BIOLÓGICAS:</span>
              {BESTIARY.map((monster, index) => (
                <div
                  key={index}
                  onClick={() => {
                    playCyberSound('click');
                    setSelectedMonster(index);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between active:scale-[0.98] ${
                    selectedMonster === index
                      ? 'bg-purple-950/50 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(147,51,234,0.4)] font-bold'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <div>
                    <div className="text-xs">{monster.name.split(' ')[0]} {monster.name.split(' ')[1]}</div>
                    <div className="text-[10px] text-purple-400">{monster.mutationLevel}</div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    monster.danger === 'CATASTRÓFICO' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {monster.danger}
                  </span>
                </div>
              ))}
            </div>

            {/* Ficha Detallada de la Criatura Seleccionada */}
            <div className="lg:col-span-2 bg-[#050c1e] p-5 rounded-2xl border border-purple-500/30 space-y-4 shadow-xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                    {BESTIARY[selectedMonster].mutationLevel}
                  </span>
                  <h3 className="text-base font-black text-white">{BESTIARY[selectedMonster].name}</h3>
                </div>
                <span className="px-3 py-1 rounded-xl bg-red-950/80 text-red-400 border border-red-500/40 font-bold">
                  AMENAZA: {BESTIARY[selectedMonster].danger}
                </span>
              </div>

              <div className="space-y-3 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-black/60 border border-gray-800 text-gray-300">
                  <strong className="text-white block mb-1">Comportamiento y Biología:</strong>
                  {BESTIARY[selectedMonster].lore}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30">
                    <strong className="text-red-400 block mb-1">Puntos Débiles y Táctica:</strong>
                    <p className="text-[11px] text-gray-300">{BESTIARY[selectedMonster].weakness}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30">
                    <strong className="text-cyan-400 block mb-1">Reacción Acústica (Sonido):</strong>
                    <p className="text-[11px] text-gray-300">{BESTIARY[selectedMonster].audioReaction}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-[11px]">
                <span className="text-purple-300 font-bold">Físicas de Desmembramiento:</span>
                <span className="text-emerald-400 font-bold">✓ Activas en motor Vulkan</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA 6: MISIÓN TÁCTICA JUGABLE (LA GRAN FUGA: CELDA C-9) */}
      {viewMode === 'mission' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          {/* Header de Misión */}
          <div className="bg-gradient-to-r from-red-950/90 via-[#050c1e] to-black p-4 rounded-2xl border border-red-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                  PRISIÓN MILITAR SECTOR C-9 • MISIÓN ACTIVA
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold animate-pulse">
                  LAN COOPERATIVO CONECTADO
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
                <Crosshair className="w-5 h-5 text-red-400" />
                La Gran Fuga: Desactivar Torreón y Escapar
              </h2>
              <p className="text-xs text-gray-300 font-mono">
                {characterConfig.name} ({characterConfig.gender}) • Equipado con {characterConfig.outfit.split('(')[0]}
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-3 py-1.5 rounded-xl border font-bold ${
                guardAlertLevel === 'Normal' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' :
                guardAlertLevel === 'Alerta' ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' :
                'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
              }`}>
                {guardAlertLevel}
              </span>
            </div>
          </div>

          {/* HUD de Estado del Recluso Mendigo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            {/* Salud */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span>SALUD VITAL:</span>
                <span className="text-red-400 font-bold">{missionHealth}%</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-red-500/30">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, missionHealth)}%` }}
                />
              </div>
            </div>

            {/* Medidor de Ruido Acústico */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span>RUIDO ACÚSTICO:</span>
                <span className={`font-bold ${missionNoise > 60 ? 'text-red-400 animate-ping' : 'text-cyan-400'}`}>
                  {missionNoise}%
                </span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-cyan-500/30">
                <div
                  className={`h-full transition-all duration-300 ${
                    missionNoise > 70 ? 'bg-red-600' : missionNoise > 40 ? 'bg-amber-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, missionNoise)}%` }}
                />
              </div>
            </div>

            {/* Progreso de la Fuga */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span>PROGRESO FUGA:</span>
                <span className="text-emerald-400 font-bold">{missionProgress}%</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-emerald-500/30">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, missionProgress)}%` }}
                />
              </div>
            </div>

            {/* Clima Activo y Modificador Táctico */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">{activeSeason}</span>
                <span className="text-white font-bold text-xs truncate max-w-[100px] block">
                  {WEATHER_PRESETS[activeWeather].label.split(' ')[0]}
                </span>
              </div>
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <CloudLightning className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Banner de Sinergia de Clima sobre la Fuga */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-2.5 font-mono text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Efecto Clima: </strong>
              {activeWeather === 'tormenta_electrica'
                ? 'Los truenos enmascaran el sonido. Puedes forzar barrotes o golpear al centinela sin alertar al Licker.'
                : activeWeather === 'niebla_acida'
                ? 'La niebla reduce el cono de visión militar a 8 metros. Perfecto para cruzar el patio exterior.'
                : activeWeather === 'ventisca_nieve'
                ? 'El frío gélido adormece las articulaciones de los zombis (-30% velocidad).'
                : 'La sequía desgasta tu energía; vigila tus raciones.'}
            </span>
          </div>

          {/* Panel Principal: Acciones de Fuga y Consola Táctica */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Botones de Acción Táctica Grandes para Pulgar Móvil */}
            <div className="lg:col-span-2 space-y-3 font-mono">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Target className="w-4 h-4 text-red-400" />
                ACCIONES TÁCTICAS DISPONIBLES EN CELDA C-9
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Acción 1: Forzar Cerrojo */}
                <button
                  disabled={escapeOutcome !== 'playing'}
                  onClick={() => {
                    playCyberSound('click');
                    const soundIncrease = activeWeather === 'tormenta_electrica' ? 5 : 25;
                    const nextNoise = Math.min(100, missionNoise + soundIncrease);
                    const nextProgress = Math.min(100, missionProgress + 20);
                    setMissionNoise(nextNoise);
                    setMissionProgress(nextProgress);

                    const newLog: TacticalLog = {
                      id: `log-${Date.now()}`,
                      text: activeWeather === 'tormenta_electrica'
                        ? '⚡ ¡Aprovechaste el retumbar del trueno para destrabar el cerrojo! Ruido amortiguado (+20% progreso).'
                        : 'Hiciste chirriar los barrotes oxidados. Los centinelas aguzaron el oído (+25% ruido).',
                      type: activeWeather === 'tormenta_electrica' ? 'stealth' : 'combat',
                      time: '00:03'
                    };
                    setMissionLogs((prev) => [newLog, ...prev]);

                    if (nextProgress >= 100) {
                      setEscapeOutcome('escaped');
                      showTacticalToast('¡FUGA EXITOSA!', 'Has burlado el cerco militar y alcanzado el bosque abierto de 10,000 km².', 'success');
                    } else if (nextNoise >= 85) {
                      setGuardAlertLevel('B.O.W. Suelto');
                      showTacticalToast('¡PELIGRO INMINENTE!', 'El ruido excesivo ha atraído a un Licker Bio-Mutante al pasillo.', 'danger');
                    }
                  }}
                  className="p-3.5 rounded-2xl bg-[#050c1e] hover:bg-[#0a1530] border border-gray-700 hover:border-amber-500 transition text-left space-y-1 active:scale-[0.98] shadow-md"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Forzar Pestillo de la Reja
                    </span>
                    <span className="text-[10px] text-emerald-400">+20% Fuga</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Usa el codo del tubo oxidado de mendigo como palanca sobre el cerrojo de hierro.
                  </p>
                </button>

                {/* Acción 2: Golpe Sigiloso al Centinela */}
                <button
                  disabled={escapeOutcome !== 'playing'}
                  onClick={() => {
                    playCyberSound('approve');
                    const nextProgress = Math.min(100, missionProgress + 25);
                    const nextNoise = Math.max(5, missionNoise - 10);
                    setMissionProgress(nextProgress);
                    setMissionNoise(nextNoise);
                    setGuardAlertLevel('Alerta');

                    const newLog: TacticalLog = {
                      id: `log-${Date.now()}`,
                      text: 'Tubo de hierro impacta la nuca del centinela de la milicia. Le has quitado la tarjeta magnética.',
                      type: 'combat',
                      time: '00:05'
                    };
                    setMissionLogs((prev) => [newLog, ...prev]);

                    showTacticalToast('CENTINELA NEUTRALIZADO', 'Tarjeta de acceso del Sector C asegurada.', 'info');
                    if (nextProgress >= 100) setEscapeOutcome('escaped');
                  }}
                  className="p-3.5 rounded-2xl bg-[#050c1e] hover:bg-[#0a1530] border border-gray-700 hover:border-red-500 transition text-left space-y-1 active:scale-[0.98] shadow-md"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <Sword className="w-3.5 h-3.5 text-red-400" />
                      Ataque con Tubo Oxidado
                    </span>
                    <span className="text-[10px] text-red-400">Sigilo Letal</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Abalánzate desde las sombras y noquea al carcelero antes de que accione la radio.
                  </p>
                </button>

                {/* Acción 3: Iniciar Motín Coordinado */}
                <button
                  disabled={escapeOutcome !== 'playing'}
                  onClick={() => {
                    playCyberSound('reject');
                    const nextProgress = Math.min(100, missionProgress + 30);
                    setMissionProgress(nextProgress);
                    setMissionNoise(90);
                    setGuardAlertLevel('¡Alarma General!');

                    const newLog: TacticalLog = {
                      id: `log-${Date.now()}`,
                      text: '¡El Capitán Viktor y 14 reclusos derriban la puerta común al grito de guerra! La milicia corre a contenerlos.',
                      type: 'danger',
                      time: '00:07'
                    };
                    setMissionLogs((prev) => [newLog, ...prev]);

                    showTacticalToast('¡MOTÍN DESATADO EN EL ALA OESTE!', 'El caos atrae el fuego enemigo lejos de tu vía de escape.', 'warn');
                    if (nextProgress >= 100) setEscapeOutcome('escaped');
                  }}
                  className="p-3.5 rounded-2xl bg-[#050c1e] hover:bg-[#0a1530] border border-gray-700 hover:border-amber-500 transition text-left space-y-1 active:scale-[0.98] shadow-md"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Señal de Motín al Capitán Viktor
                    </span>
                    <span className="text-[10px] text-amber-400">+30% Fuga</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Activa a tus subordinados prisioneros para desatar una revuelta masiva de distracción.
                  </p>
                </button>

                {/* Acción 4: Comer Ración de Pan Rancio y Agua */}
                <button
                  disabled={escapeOutcome !== 'playing' || missionHealth >= 100}
                  onClick={() => {
                    playCyberSound('approve');
                    setMissionHealth((prev) => Math.min(100, prev + 25));
                    setMissionNoise((prev) => Math.max(5, prev - 15));

                    const newLog: TacticalLog = {
                      id: `log-${Date.now()}`,
                      text: 'Bebiste del termo de agua de lluvia y comiste el mendrugo de pan. Salud +25 HP.',
                      type: 'info',
                      time: '00:09'
                    };
                    setMissionLogs((prev) => [newLog, ...prev]);
                    showTacticalToast('VITALIDAD RESTAURADA', '+25 HP recuperados.', 'success');
                  }}
                  className="p-3.5 rounded-2xl bg-[#050c1e] hover:bg-[#0a1530] border border-gray-700 hover:border-emerald-500 transition text-left space-y-1 active:scale-[0.98] shadow-md"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      Consumir Ración de Emergencia
                    </span>
                    <span className="text-[10px] text-emerald-400">+25 HP</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Recupera energía vital y estabiliza tu pulso cardíaco para no temblar al moverte.
                  </p>
                </button>
              </div>

              {/* Mensaje de Victoria o Derrota */}
              {escapeOutcome === 'escaped' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#050c1e] to-emerald-950/80 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] text-center space-y-3">
                  <div className="text-3xl">🎉</div>
                  <h3 className="text-base font-black text-white font-mono uppercase">
                    ¡FUGA EXITOSA! HAS LLEGADO AL BOSQUE DE 10,000 KM²
                  </h3>
                  <p className="text-xs text-emerald-300 max-w-md mx-auto">
                    Has cortado la alambrada y dejado atrás la prisión esclavista. Tus capitanes se han reunido contigo en el primer campamento secreto.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1 font-mono text-xs">
                    <button
                      onClick={() => {
                        playCyberSound('approve');
                        setViewMode('camp');
                        showTacticalToast('CAMPAMENTO FUNDADO', 'Las 25 facciones te han detectado en el Sector B-4: interceptando amenazas.', 'warn');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:brightness-110 text-white font-bold transition shadow-lg flex items-center gap-1.5"
                    >
                      <Tent className="w-4 h-4" />
                      <span>🏕️ Fundar Campamento & Gestionar Asedios</span>
                    </button>
                    <button
                      onClick={() => setViewMode('hierarchy')}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg"
                    >
                      👑 Abrir Pirámide de Mando
                    </button>
                    <button
                      onClick={() => {
                        setEscapeOutcome('playing');
                        setMissionProgress(20);
                        setMissionNoise(15);
                        setMissionHealth(85);
                        setGuardAlertLevel('Normal');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-gray-300 font-bold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                      Repetir Fuga
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Consola de Registro Táctico en Vivo */}
            <div className="bg-[#050c1e] p-4 rounded-2xl border border-gray-800 space-y-3 shadow-xl font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    CANAL DE COMUNICACIÓN C-9
                  </h4>
                  <span className="text-[10px] text-emerald-400">EN VIVO</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2.5 text-[11px]">
                  {missionLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2.5 rounded-xl border leading-relaxed ${
                        log.type === 'danger' ? 'bg-red-950/40 border-red-500/40 text-red-200' :
                        log.type === 'combat' ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' :
                        log.type === 'stealth' ? 'bg-blue-950/40 border-blue-500/40 text-blue-200' :
                        'bg-black/50 border-gray-800 text-gray-300'
                      }`}
                    >
                      <span className="text-[9px] text-gray-500 block mb-0.5">[{log.time}] TRANSMISIÓN:</span>
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-2">
                <div className="text-[10px] text-gray-400">
                  <strong>Equipamiento del Recluso:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-gray-300">
                    <li>Harapos raídos de mendigo (Sin chaleco)</li>
                    <li>Tubo de cañería con óxido (+15 daño)</li>
                    <li>Tarjeta magnética del Sector C</li>
                  </ul>
                </div>

                <button
                  onClick={() => setViewMode('lobby')}
                  className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Volver al Lobby LAN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA 7: EXPORTADOR DE CÓDIGO GODOT 4.3 Y GENERADOR DE APK ANDROID */}
      {viewMode === 'apk_export' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-950/90 via-[#050c1e] to-black p-4 rounded-2xl border border-cyan-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  ARQUITECTURA STANDALONE • COM.TACTICAL.DEADLAN
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  GODOT 4.3 VULKAN MOBILE
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
                <Download className="w-5 h-5 text-cyan-400" />
                Exportador de Proyecto APK para Android
              </h2>
              <p className="text-xs text-gray-300 font-mono">
                Archivos de configuración nativa para compilar tu APK LAN P2P sin internet en tu teléfono o PC.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                ENet P2P • 0 Servidores Externos
              </span>
            </div>
          </div>

          {/* Selector de Archivos del Proyecto */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setSelectedApkFile('project_godot')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                selectedApkFile === 'project_godot'
                  ? 'bg-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-[#050c1e] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>project.godot (Vulkan)</span>
            </button>

            <button
              onClick={() => setSelectedApkFile('network_manager')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                selectedApkFile === 'network_manager'
                  ? 'bg-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-[#050c1e] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>NetworkManager.gd (P2P LAN)</span>
            </button>

            <button
              onClick={() => setSelectedApkFile('android_manifest')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                selectedApkFile === 'android_manifest'
                  ? 'bg-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-[#050c1e] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>AndroidManifest.xml (Permisos)</span>
            </button>

            <button
              onClick={() => setSelectedApkFile('quick_start')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                selectedApkFile === 'quick_start'
                  ? 'bg-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-[#050c1e] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Guía Compilación APK</span>
            </button>
          </div>

          {/* Visor de Código con Botón de Copiar y Descargar */}
          <div className="bg-[#050c1e] rounded-2xl border border-gray-800 shadow-xl overflow-hidden font-mono text-xs">
            <div className="bg-black/60 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <span className="text-gray-300 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {selectedApkFile === 'project_godot' && 'project.godot — Configuración Vulkan Mobile PBR'}
                {selectedApkFile === 'network_manager' && 'scripts/NetworkManager.gd — Servidor LAN ENet P2P'}
                {selectedApkFile === 'android_manifest' && 'android/build/AndroidManifest.xml — Socket LAN & Wi-Fi'}
                {selectedApkFile === 'quick_start' && 'README_APK.txt — Paso a Paso para generar com.tactical.deadlan'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const codeMap = {
                      project_godot: `; DEAD LAN - GODOT 4.3 VULKAN CONFIGURATION
config_version=5

[application]
config/name="DEAD LAN"
config/description="Juego táctico de supervivencia en mundo abierto 10,000 km2 multijugador LAN sin internet"
run/main_scene="res://scenes/Lobby.tscn"
config/features=PackedStringArray("4.3", "Mobile", "Vulkan")
boot_splash/image="res://assets/dead_lan_cover.png"
boot_splash/fullsize=true

[display]
window/size/viewport_width=1920
window/size/viewport_height=1080
window/stretch/mode="canvas_items"
window/stretch/aspect="expand"
window/handheld/orientation=1

[rendering]
renderer/rendering_method="mobile"
textures/vram_compression/import_etc2_astc=true
anti_aliasing/screen_space_roughness_limiter/enabled=true
environment/defaults/default_clear_color=Color(0.01, 0.02, 0.05, 1)

[network]
limits/debugger/max_chars_per_second=32768
`,
                      network_manager: `extends Node
# DEAD LAN - MULTIJUGADOR LAN P2P SIN INTERNET (ENET)
# com.tactical.deadlan

const DEFAULT_PORT := 7777
const MAX_PLAYERS := 8

var peer := ENetMultiplayerPeer.new()
var is_host := false

signal player_connected(id)
signal player_disconnected(id)

func _ready() -> void:
	multiplayer.peer_connected.connect(_on_peer_connected)
	multiplayer.peer_disconnected.connect(_on_peer_disconnected)

func host_game(port: int = DEFAULT_PORT) -> Error:
	var err = peer.create_server(port, MAX_PLAYERS)
	if err == OK:
		multiplayer.multiplayer_peer = peer
		is_host = true
		print("[DEAD LAN] Servidor LAN creado con éxito en puerto: ", port)
	return err

func join_game(ip: String, port: int = DEFAULT_PORT) -> Error:
	var err = peer.create_client(ip, port)
	if err == OK:
		multiplayer.multiplayer_peer = peer
		is_host = false
		print("[DEAD LAN] Conectando al Host LAN en: ", ip, ":", port)
	return err

func _on_peer_connected(id: int) -> void:
	print("[DEAD LAN] Superviviente conectado con ID: ", id)
	emit_signal("player_connected", id)

func _on_peer_disconnected(id: int) -> void:
	print("[DEAD LAN] Superviviente desconectado con ID: ", id)
	emit_signal("player_disconnected", id)

@rpc("any_peer", "call_local")
func sync_character_data(char_data: Dictionary) -> void:
	print("[DEAD LAN] Recibida apariencia de recluso mendigo: ", char_data)
`,
                      android_manifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tactical.deadlan"
    android:versionCode="1"
    android:versionName="1.0.0">

    <!-- PERMISOS CRÍTICOS PARA RED LOCAL LAN P2P SIN INTERNET -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:label="DEAD LAN"
        android:icon="@mipmap/icon"
        android:allowBackup="false"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name="com.godot.game.GodotApp"
            android:screenOrientation="sensorLandscape"
            android:configChanges="orientation|keyboardHidden|screenSize|smallestScreenSize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
                      quick_start: `========================================================================
PASO A PASO PARA COMPILAR DEAD LAN EN APK PARA TU MÓVIL ANDROID
========================================================================
1. Descarga Godot Engine 4.3 (Mobile o Standard) desde godotengine.org (o la app Godot en Google Play Store).
2. Crea un proyecto nuevo llamado "DEAD LAN" y pega el archivo "project.godot" en la raíz.
3. Copia "NetworkManager.gd" dentro de la carpeta "scripts/".
4. En Proyecto -> Ajustes del Proyecto -> Autoload: añade NetworkManager.gd.
5. Conecta tus teléfonos a la misma red Wi-Fi o crea un "Punto de acceso portátil" (Hotspot) desde los Ajustes del móvil sin datos móviles.
6. El Host inicia la partida y los demás colocan 192.168.43.1.
7. ¡Disfruta de la supervivencia cooperativa sin consumir datos ni depender de servidores!
`
                    };

                    const text = codeMap[selectedApkFile];
                    navigator.clipboard.writeText(text);
                    setCopiedFile(selectedApkFile);
                    playCyberSound('approve');
                    showTacticalToast('CÓDIGO COPIADO', 'Archivo listo en tu portapapeles para pegar en Godot.', 'success');
                    setTimeout(() => setCopiedFile(null), 2500);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-[11px] font-bold transition flex items-center gap-1 active:scale-95"
                >
                  {copiedFile === selectedApkFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bloque de Código Preformateado */}
            <div className="p-4 bg-black/80 overflow-x-auto text-[11px] font-mono text-gray-300 leading-relaxed max-h-96">
              <pre>
                {selectedApkFile === 'project_godot' && `; DEAD LAN - GODOT 4.3 VULKAN CONFIGURATION
config_version=5

[application]
config/name="DEAD LAN"
config/description="Juego táctico de supervivencia en mundo abierto 10,000 km2 multijugador LAN sin internet"
run/main_scene="res://scenes/Lobby.tscn"
config/features=PackedStringArray("4.3", "Mobile", "Vulkan")
boot_splash/image="res://assets/dead_lan_cover.png"
boot_splash/fullsize=true

[display]
window/size/viewport_width=1920
window/size/viewport_height=1080
window/stretch/mode="canvas_items"
window/stretch/aspect="expand"
window/handheld/orientation=1

[rendering]
renderer/rendering_method="mobile"
textures/vram_compression/import_etc2_astc=true
anti_aliasing/screen_space_roughness_limiter/enabled=true
environment/defaults/default_clear_color=Color(0.01, 0.02, 0.05, 1)

[network]
limits/debugger/max_chars_per_second=32768`}

                {selectedApkFile === 'network_manager' && `extends Node
# DEAD LAN - MULTIJUGADOR LAN P2P SIN INTERNET (ENET)
# com.tactical.deadlan

const DEFAULT_PORT := 7777
const MAX_PLAYERS := 8

var peer := ENetMultiplayerPeer.new()
var is_host := false

signal player_connected(id)
signal player_disconnected(id)

func _ready() -> void:
	multiplayer.peer_connected.connect(_on_peer_connected)
	multiplayer.peer_disconnected.connect(_on_peer_disconnected)

func host_game(port: int = DEFAULT_PORT) -> Error:
	var err = peer.create_server(port, MAX_PLAYERS)
	if err == OK:
		multiplayer.multiplayer_peer = peer
		is_host = true
		print("[DEAD LAN] Servidor LAN creado con éxito en puerto: ", port)
	return err

func join_game(ip: String, port: int = DEFAULT_PORT) -> Error:
	var err = peer.create_client(ip, port)
	if err == OK:
		multiplayer.multiplayer_peer = peer
		is_host = false
		print("[DEAD LAN] Conectando al Host LAN en: ", ip, ":", port)
	return err

func _on_peer_connected(id: int) -> void:
	print("[DEAD LAN] Superviviente conectado con ID: ", id)
	emit_signal("player_connected", id)

func _on_peer_disconnected(id: int) -> void:
	print("[DEAD LAN] Superviviente desconectado con ID: ", id)
	emit_signal("player_disconnected", id)

@rpc("any_peer", "call_local")
func sync_character_data(char_data: Dictionary) -> void:
	print("[DEAD LAN] Recibida apariencia de recluso mendigo: ", char_data)`}

                {selectedApkFile === 'android_manifest' && `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tactical.deadlan"
    android:versionCode="1"
    android:versionName="1.0.0">

    <!-- PERMISOS CRÍTICOS PARA RED LOCAL LAN P2P SIN INTERNET -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:label="DEAD LAN"
        android:icon="@mipmap/icon"
        android:allowBackup="false"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name="com.godot.game.GodotApp"
            android:screenOrientation="sensorLandscape"
            android:configChanges="orientation|keyboardHidden|screenSize|smallestScreenSize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`}

                {selectedApkFile === 'quick_start' && `========================================================================
PASO A PASO PARA COMPILAR DEAD LAN EN APK PARA TU MÓVIL ANDROID
========================================================================
1. Descarga Godot Engine 4.3 (Mobile o Standard) desde godotengine.org (o la app Godot en Google Play Store).
2. Crea un proyecto nuevo llamado "DEAD LAN" y pega el archivo "project.godot" en la raíz.
3. Copia "NetworkManager.gd" dentro de la carpeta "scripts/".
4. En Proyecto -> Ajustes del Proyecto -> Autoload: añade NetworkManager.gd.
5. Conecta tus teléfonos a la misma red Wi-Fi o crea un "Punto de acceso portátil" (Hotspot) desde los Ajustes del móvil sin datos móviles.
6. El Host inicia la partida y los demás colocan 192.168.43.1.
7. ¡Disfruta de la supervivencia cooperativa sin consumir datos ni depender de servidores!`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA 8: PRIMER CAMPAMENTO REFUGIO & SISTEMA DE ASEDIO / SAQUEO DE FACCIONES */}
      {viewMode === 'camp' && (
        <div className="flex-1 p-3 sm:p-4 max-w-5xl mx-auto w-full space-y-4 animate-fadeIn">
          {/* Header del Campamento */}
          <div className="bg-gradient-to-r from-amber-950/90 via-[#050c1e] to-black p-4 rounded-2xl border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {campData.location}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold animate-pulse">
                  25 FACCIONES EN ALERTA
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
                <Tent className="w-5 h-5 text-amber-400" />
                {campData.name}
              </h2>
              <p className="text-xs text-gray-300 font-mono">
                Primer Asentamiento Fundado tras la Fuga • Nivel de Fortificación: {campData.fortificationLevel}/5
              </p>
            </div>

            {/* Controles de Camuflaje y Humo */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                onClick={() => {
                  playCyberSound('switch');
                  const nextStealth = !campData.stealthActive;
                  setCampData({
                    ...campData,
                    stealthActive: nextStealth,
                    smokeVisibility: nextStealth ? 0 : 25
                  });
                  showTacticalToast(
                    nextStealth ? 'MODO SIGILO NOCTURNO' : 'FOGATAS ENCENDIDAS',
                    nextStealth
                      ? 'Fogatas apagadas y luces camufladas. Firma de humo reducida al 0% (invisibles para patrullas).'
                      : 'Fogatas encendidas. Tus tropas tienen calor pero el humo es visible a 5 km.',
                    nextStealth ? 'success' : 'warn'
                  );
                }}
                className={`px-3 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 active:scale-95 ${
                  campData.stealthActive
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${campData.stealthActive ? 'text-gray-500' : 'text-amber-400'}`} />
                <span>{campData.stealthActive ? '✓ Fogatas Apagadas (0% Humo)' : 'Modo Furtivo: Apagar Fogatas'}</span>
              </button>
            </div>
          </div>

          {/* HUD de Recursos del Campamento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            {/* Comida / Raciones */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span>RACIONES COMIDA:</span>
                <span className="text-amber-400 font-bold">{campData.food} raciones</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-amber-500/30">
                <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, campData.food)}%` }} />
              </div>
              <span className="text-[9px] text-gray-500">Alimenta a 44 tropas diarias</span>
            </div>

            {/* Agua Potable */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span>AGUA POTABLE:</span>
                <span className="text-cyan-400 font-bold">{campData.water} L</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-cyan-500/30">
                <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, campData.water)}%` }} />
              </div>
              <span className="text-[9px] text-gray-500">Filtro de lluvia activo</span>
            </div>

            {/* Munición Balística */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span>MUNICIÓN:</span>
                <span className="text-red-400 font-bold">{campData.ammo} balas</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-red-500/30">
                <div className="h-full bg-red-500" style={{ width: `${Math.min(100, campData.ammo)}%` }} />
              </div>
              <span className="text-[9px] text-gray-500">Para repeler asaltos armados</span>
            </div>

            {/* Chatarra y Fortificaciones */}
            <div className="p-3 rounded-2xl bg-[#050c1e] border border-gray-800 space-y-1 shadow-lg">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span>CHATARRA & DEFENSAS:</span>
                <span className="text-emerald-400 font-bold">{campData.scrap} uds</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-emerald-500/30">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, campData.scrap)}%` }} />
              </div>
              <button
                disabled={campData.scrap < 25 || campData.fortificationLevel >= 5}
                onClick={() => {
                  playCyberSound('approve');
                  setCampData({
                    ...campData,
                    scrap: campData.scrap - 25,
                    fortificationLevel: campData.fortificationLevel + 1
                  });
                  setCampRadioLogs((prev) => [
                    `Capitán Viktor reforzó el campamento a Nivel ${campData.fortificationLevel + 1} (Torre de centinela y foso de púas).`,
                    ...prev
                  ]);
                  showTacticalToast('DEFENSAS MEJORADAS', `Fortificación elevada a Nivel ${campData.fortificationLevel + 1}/5.`, 'success');
                }}
                className={`text-[9px] font-bold block transition ${
                  campData.scrap >= 25 && campData.fortificationLevel < 5
                    ? 'text-emerald-400 hover:underline'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                + Mejorar Defensas (-25 Chatarra)
              </button>
            </div>
          </div>

          {/* Banner de Advertencia de las 25 Facciones */}
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-2.5 font-mono text-xs text-red-200 shadow-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="text-white block">RESPUESTA DE LAS 25 FACCIONES TRAS FUNDAR TU CAMPAMENTO:</strong>
              <p className="text-[11px] leading-relaxed text-gray-300 font-sans mt-0.5">
                Al encender las primeras fogatas y levantar la alambrada, las facciones del páramo de 10,000 km² te han tomado en cuenta.
                <strong> La Milicia Esclavista</strong> y <strong>Los Desolladores</strong> intentan asediarte o saquear tus víveres, mientras facciones como <strong>Los Conquistadores</strong> te exigen complots para atacar a sus enemigos jurados.
              </p>
            </div>
          </div>

          {/* Panel Principal: Demandas, Amenazas de Saqueo y Asedios Activos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Lista de Amenazas de Facciones */}
            <div className="lg:col-span-2 space-y-3 font-mono">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                TRANSMISIONES DE FACCIONES • ASEDIO & SAQUEO EN CURSO
              </h3>

              <div className="space-y-3">
                {factionThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 font-mono text-xs ${
                      threat.status === 'repelido'
                        ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                        : threat.status === 'aliado'
                        ? 'bg-blue-950/20 border-blue-500/40 opacity-75'
                        : threat.status === 'pagado' || threat.status === 'evadido'
                        ? 'bg-stone-900/40 border-stone-700 opacity-70'
                        : threat.type === 'asedio'
                        ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                        : threat.type === 'complot'
                        ? 'bg-blue-950/30 border-blue-500/60 shadow-[0_0_20px_rgba(37,99,235,0.25)]'
                        : 'bg-amber-950/30 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    }`}
                  >
                    {/* Header de la Amenaza */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-white font-bold uppercase tracking-wider">
                          {threat.faction}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{threat.title}</h4>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-xl font-bold uppercase ${
                        threat.status === 'repelido' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        threat.status === 'aliado' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                        threat.status === 'pagado' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        threat.status === 'evadido' ? 'bg-stone-500/20 text-stone-300 border border-stone-500/40' :
                        'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                      }`}>
                        {threat.status === 'pendiente' ? threat.type.toUpperCase() : threat.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Descripción y Demanda */}
                    <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                      {threat.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                      <div>
                        <span className="text-gray-400 block">Exigencia / Objetivo:</span>
                        <span className="text-amber-300 font-bold">{threat.demands}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block">Recompensa / Botín:</span>
                        <span className="text-emerald-400 font-bold">{threat.reward}</span>
                      </div>
                    </div>

                    {/* Botones de Respuesta Táctica según el tipo de amenaza */}
                    {threat.status === 'pendiente' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {threat.type === 'asedio' && (
                          <>
                            <button
                              onClick={() => {
                                playCyberSound('reject');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  ammo: Math.max(0, campData.ammo - 10),
                                  scrap: campData.scrap + 30
                                });
                                setCampRadioLogs((prev) => [
                                  '⚔️ ¡Asedio repelido! Sargento Morales y la escuadra de choque diezmaron a los atacantes en el desfiladero.',
                                  ...prev
                                ]);
                                showTacticalToast('¡ASEDIO REPELIDO CON ÉXITO!', 'Vehículo blindado de la Milicia capturado (+30 Chatarra).', 'success');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-[11px]"
                            >
                              <Sword className="w-3.5 h-3.5" />
                              <span>Repeler Asedio Armado</span>
                            </button>

                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'evadido' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  stealthActive: true,
                                  smokeVisibility: 0
                                });
                                setCampRadioLogs((prev) => [
                                  '🌾 Fogatas apagadas. La patrulla militar pasó de largo en la niebla sin divisar el campamento.',
                                  ...prev
                                ]);
                                showTacticalToast('CAMUFLAJE FORESTAL EXITOSO', 'El convoy enemigo continuó de largo en la oscuridad.', 'info');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-gray-200 border border-gray-700 font-bold transition flex items-center justify-center gap-1.5 active:scale-95 text-[11px]"
                            >
                              <Flame className="w-3.5 h-3.5 text-gray-400" />
                              <span>Apagar Fogatas & Sigilo</span>
                            </button>

                            <button
                              onClick={() => {
                                playCyberSound('receive');
                                if (campData.food < 35) {
                                  showTacticalToast('FALTA DE COMIDA', 'No tienes suficientes raciones para pagar el tributo.', 'warn');
                                  return;
                                }
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'pagado' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  food: campData.food - 35
                                });
                                setCampRadioLogs((prev) => [
                                  '📦 Pagadas 35 raciones de tributo a la Milicia para comprar 24h de tregua.',
                                  ...prev
                                ]);
                                showTacticalToast('TRIBUTO PAGADO', '-35 Raciones entregadas para evitar la destrucción del campamento.', 'warn');
                              }}
                              className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition flex items-center justify-center gap-1 text-[10px]"
                            >
                              <span>Ceder Raciones (-35 Comida)</span>
                            </button>

                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampRadioLogs((prev) => [
                                  '🕵️ Lugarteniente Vance saboteó los tanques de gasolina de la Milicia antes de que salieran.',
                                  ...prev
                                ]);
                                showTacticalToast('SABOTAJE NOCTURNO', 'Vance neutralizó el convoy en su propia base.', 'success');
                              }}
                              className="py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold transition flex items-center justify-center gap-1 text-[10px]"
                            >
                              <span>Infiltración Vance (Asesinato)</span>
                            </button>
                          </>
                        )}

                        {threat.type === 'complot' && (
                          <>
                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'aliado' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  ammo: campData.ammo + 50,
                                  food: campData.food + 20
                                });
                                setCampRadioLogs((prev) => [
                                  '🤝 Asalto conjunto exitoso con Los Conquistadores. Repartidas 50 municiones y 20 raciones.',
                                  ...prev
                                ]);
                                showTacticalToast('COMPLOT COMPLETADO', 'Alianza sellada con Los Conquistadores (+50 Munición).', 'success');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-[11px]"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Aceptar Complot & Saquear Convoy</span>
                            </button>

                            <button
                              onClick={() => {
                                playCyberSound('click');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'evadido' } : t))
                                );
                                setCampRadioLogs((prev) => [
                                  '🚫 Rechazada la oferta de Los Conquistadores. Se retiran con recelo a su territorio.',
                                  ...prev
                                ]);
                                showTacticalToast('OFERTA RECHAZADA', 'Mantienes la neutralidad en el Sector B-4.', 'info');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-gray-300 border border-gray-700 font-bold transition flex items-center justify-center gap-1.5 active:scale-95 text-[11px]"
                            >
                              <span>Rechazar Petición de Ataque</span>
                            </button>
                          </>
                        )}

                        {threat.type === 'saqueo' && (
                          <>
                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  scrap: campData.scrap + 20
                                });
                                setCampRadioLogs((prev) => [
                                  '💥 Viktor activó las trampas sonoras y fosos de estacas. Los Desolladores huyeron dispersos.',
                                  ...prev
                                ]);
                                showTacticalToast('¡SAQUEO FRUSTRADO!', 'Almacén de víveres protegido al 100%. (+20 Chatarra).', 'success');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-[11px]"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Activar Trampas Sonoras con Pólvora</span>
                            </button>

                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampRadioLogs((prev) => [
                                  '🏹 Emboscada en el perímetro: 2 saqueadores capturados como prisioneros para interrogatorio.',
                                  ...prev
                                ]);
                                showTacticalToast('EMBOSCADA EXITOSA', '2 Prisioneros capturados con información de bases enemigas.', 'info');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-gray-300 border border-gray-700 font-bold transition flex items-center justify-center gap-1.5 active:scale-95 text-[11px]"
                            >
                              <Target className="w-3.5 h-3.5" />
                              <span>Emboscada de Centinelas</span>
                            </button>
                          </>
                        )}

                        {threat.type === 'ataque_directo' && (
                          <>
                            <button
                              onClick={() => {
                                playCyberSound('reject');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  ammo: Math.max(0, campData.ammo - 15),
                                  scrap: campData.scrap + 35
                                });
                                setCampRadioLogs((prev) => [
                                  '💥 ¡INVASIÓN MASIVA REPELIDA! El fuego cruzado destruyó las camionetas enemigas. Capturado camión artillado (+35 Chatarra).',
                                  ...prev
                                ]);
                                showTacticalToast('¡ATAQUE DIRECTO REPELIDO!', 'Milicia en retirada tras perder 12 soldados y 2 vehículos blindados.', 'success');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-[11px]"
                            >
                              <Sword className="w-3.5 h-3.5" />
                              <span>Fuego Cruzado: Repeler Asalto (-15 Balas)</span>
                            </button>

                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  ammo: Math.max(0, campData.ammo - 5),
                                  scrap: campData.scrap + 20
                                });
                                setCampRadioLogs((prev) => [
                                  '💣 Viktor detonó las minas perimetrales de fósforo. La primera camioneta blindada voló por los aires.',
                                  ...prev
                                ]);
                                showTacticalToast('MINAS ACCIONADAS', 'Vanguardia blindada enemiga incinerada al tocar la alambrada.', 'success');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center justify-center gap-1.5 active:scale-95 text-[11px]"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Detonar Minas de Alambre</span>
                            </button>
                          </>
                        )}

                        {threat.type === 'espionaje_asesinato' && (
                          <>
                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampData({
                                  ...campData,
                                  ammo: campData.ammo + 15
                                });
                                setCampRadioLogs((prev) => [
                                  '🔍 Vance interceptó a los dos espías falsos refugiados antes de llegar a la tienda del líder. Cuchillos decomisados.',
                                  ...prev
                                ]);
                                showTacticalToast('ESPÍAS DESENMASCARADOS', 'Vance evitó el asesinato en silencio (+15 Munición recuperada).', 'success');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-[11px]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Interrogar y Neutralizar con Vance</span>
                            </button>

                            <button
                              onClick={() => {
                                playCyberSound('approve');
                                setFactionThreats(
                                  factionThreats.map((t) => (t.id === threat.id ? { ...t, status: 'repelido' } : t))
                                );
                                setCampRadioLogs((prev) => [
                                  '⛓️ Espías encadenados en fosa común. Revelaron las coordenadas del búnker principal de Los Susurradores.',
                                  ...prev
                                ]);
                                showTacticalToast('INFORMACIÓN OBTENIDA', 'Espías capturados revelan bases de las otras 23 facciones.', 'info');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-gray-200 border border-gray-700 font-bold transition flex items-center justify-center gap-1.5 active:scale-95 text-[11px]"
                            >
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Encadenar y Extraer Inteligencia</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Consola de Radiofrecuencia y Estado de Centinelas */}
            <div className="bg-[#050c1e] p-4 rounded-2xl border border-gray-800 space-y-3 shadow-xl font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    RADIOFRECUENCIA DE SECTOR
                  </h4>
                  <span className="text-[10px] text-amber-400 animate-pulse">CANAL ABIERTO</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2.5 text-[11px]">
                  {campRadioLogs.map((log, index) => (
                    <div
                      key={index}
                      className="p-2.5 rounded-xl bg-black/60 border border-gray-800 text-gray-300 leading-relaxed"
                    >
                      <span className="text-[9px] text-amber-400 block mb-0.5">ORDEN DE CAMPAMENTO:</span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-2">
                <div className="p-2.5 rounded-xl bg-black/40 border border-gray-800 text-[10px] text-gray-400 space-y-1">
                  <strong className="text-white block">Estado de la Defensa:</strong>
                  <div>• Centinelas apostados: <strong>{campData.guardsAssigned} prisioneros armados</strong></div>
                  <div>• Visibilidad de humo: <strong>{campData.smokeVisibility}% ({campData.stealthActive ? 'Oculto' : 'Visible a patrullas'})</strong></div>
                  <div>• Facciones hostiles activas: <strong>25 ejércitos en el mapa de 10,000 km²</strong></div>
                </div>

                <button
                  onClick={() => setViewMode('hierarchy')}
                  className="w-full py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ver Tropas en la Pirámide de Mando</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

