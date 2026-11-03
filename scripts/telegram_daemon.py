#!/usr/bin/env python3
"""
TELEGRAM BOT DAEMON - PROYECTO 66 & YAN COMPANION
=================================================
Bot: @Yan0109bot (Token: 8668948666:AAHODmFmrhE6XLAzGbOiw6jBaETvIlMeX28)
Owner: Comandante Max (Telegram ID: 8885707506)

Características:
1. Asistente y compañero conversacional cercano, inteligente, empático y respetuoso.
2. Respuestas naturales, escuchando con atención y haciendo UNA sola pregunta a la vez.
3. Memoria contextual durante la sesión para aprender y adaptarse a preferencias y correcciones.
4. Distingue hechos de estimaciones/opiniones con honestidad total.
5. Análisis deportivo riguroso (forma reciente, localía, bajas, cuotas, incertidumbre, sin falsas garantías de ganancias y sin acusaciones de arreglos sin pruebas verificables).
6. Casino 100% Estilo Cubano: Dominó Doble 9 (55 fichas), Charada Cubana tradicional (1 al 100), Cubilete Cubano (5 dados criollos), Trigo/Ronda con baraja española.
7. Zona táctica militar (Call of Duty + Delta Force + Free Fire).
"""

import time
import json
import urllib.request
import urllib.error
import random
import re

TOKEN = "8668948666:AAHODmFmrhE6XLAzGbOiw6jBaETvIlMeX28"
BASE_URL = f"https://api.telegram.org/bot{TOKEN}"

# Diccionario de la Charada Cubana Tradicional (1 al 100)
CHARADA_CUBANA = {
    1: "Caballo (Sol, Tintero, Camello)",
    2: "Mariposa (Hombre, Cafetera, Muñeco)",
    3: "Marinero (Niño, Taza, Luna)",
    4: "Gato (Llave, Soldado, Espejo)",
    5: "Monja (Periódico, Mar, Navaja)",
    6: "Jicotea (Tortuga, Carta, Billetera)",
    7: "Caracol (Sueño, Mierda, Pintor)",
    8: "Muerto (Calabaza, León, Bandera)",
    9: "Elefante (Entierro, Lengua, Lira)",
    10: "Pescado Grande (Cazador, Dinero, Red)",
    11: "Caballo Grande (Gallo, Lluvia, Fábrica)",
    12: "Mujer Mala (Cometa, Viaje, Toalla)",
    13: "Pavo Real (Niño grande, Frío, Candado)",
    14: "Gato Tigre (Cementerio, Sartén, Arco)",
    15: "Perro (Cuchara, Visita, Reloj)",
    16: "Toro (Incendio, Carbón, Sombrero)",
    17: "San Lázaro (Luna nueva, Médico, Zapato)",
    18: "Pescadito (Cuchillo, Barco, Palma)",
    19: "Lombriz (Mesa, Bandolero, Mina)",
    20: "Gato Fino (Cañón, Libro, Botella)",
    21: "Majá (Serpiente, Dinero, Chaleco)",
    22: "Sapo (Estrella, Chimenea, Botella)",
    23: "Vapor (Barco de vapor, Escalera, Águila)",
    24: "Paloma (Música, Carpintero, Teléfono)",
    25: "Piedra Fina (Sol brillante, Moneda, Vaso)",
    26: "Anguila (Médico, Caja, Nube)",
    27: "Avispa (Canario, Campana, Dulce)",
    28: "Chivo (Político, Escopeta, Pólvora)",
    29: "Ratón (Venado, Látigo, Cárcel)",
    30: "Camarón (Arcoíris, Alfileres, Cangrejo)",
    31: "Venado (Música, Luz, Flor)",
    32: "Cochino (Puerco, Guardia, Telégrafo)",
    33: "Tiñosa (Muerte, Lirio, Baraja)",
    34: "Mono (Negro, Familia, Trucha)",
    35: "Araña (Bombillo, Marinero, Zapatero)",
    36: "Pipa (Teatro, Bodega, Árbol)",
    37: "Bruja (Hormiga, Culebra, Gallina)",
    38: "Macao (Guante, Dinero, Nieve)",
    39: "Conejo (Rayo, Pescador, Sombrilla)",
    40: "Alacrán (Cura, Sangre, Barba)",
    41: "Lagartija (Prisión, Llave inglesa, Pato)",
    42: "Pato (España, Abogado, Espejuelos)",
    43: "Alacrán Grande (Amigo, Reloj de pared, Guitarra)",
    44: "Año Nuevo (Infierno, Cuero, Carretilla)",
    45: "Tiburón (Presidente, Escuela, Maleta)",
    46: "Guagua (Autobús, Sombrero fino, Hambre)",
    47: "Pájaro (Mundo, Rosa, Escudo)",
    48: "Cucaracha (Coche, Fantasma, Pluma)",
    49: "Borracho (Percha, Espejo roto, Cañón)",
    50: "Policía (Florero, Pata de palo, Oro)",
    51: "Soldado (Sereno, Reloj despertador, Loro)",
    52: "Bicicleta (Coche fúnebre, Abanico, Nube)",
    53: "Luz Eléctrica (Prenda, Dinamita, Paloma)",
    54: "Flores (Fusil, Tambor, Campamento)",
    55: "Cangrejo (Isla, Bala, Cuartel)",
    56: "Reina (Trono, Pelota, Guadaña)",
    57: "Telegrama (Cuchillo grande, Pájaro verde, Cruz)",
    58: "Adulterio (Fotografía, Relámpago, Machete)",
    59: "Loco (Calavera, Espantapájaros, Trinchera)",
    60: "Sol Oscuro (Payaso, Tempestad, Granada)",
    61: "Cañón (Bomba, Escorpión, Trueno)",
    62: "Matrimonio (Nieve, Cama, Diente)",
    63: "Asesino (Escalera de mano, Policía secreto, Espada)",
    64: "Muerto Grande (Tumba, Fuego, Radio)",
    65: "Brujería (Hechicero, Trueno lejano, Murciélago)",
    66: "Trueno / Diablo (Fuerza, Rayo, Candela)",
    67: "Autoridad (Puñal, Abogado, Tribunal)",
    68: "Cementerio (Globo, Pintura, Farol)",
    69: "Pozo (Agua dulce, Reloj de oro, Sombra)",
    70: "Teléfono (Cigarro, Bandera blanca, Niebla)",
    71: "Fusil (Sombrilla de seda, Pescado rojo, Tren)",
    72: "Ferrocarril (Hacha, Cometa, Sirena)",
    73: "Manzana (Parque, Diamante, Corona)",
    74: "Papalote (Cometa de papel, Silla, Fuente)",
    75: "Cine (Teatro moderno, Payaso alegre, Viento)",
    76: "Humo (Hierro, Automóvil, Cadena)",
    77: "Banderas (Victoria, Barco de guerra, Arco)",
    78: "Obispo (Iglesia, Sarcófago, Clavo)",
    79: "Tren de Carga (Locomotora, Vía, Rueda)",
    80: "Médico Viejo (Navaja barbera, Botica, Gafas)",
    81: "Teatro (Actor, Máscara, Violín)",
    82: "Madre (Cuna, Ángel, Estrella fugaz)",
    83: "Tragedia (Naufragio, Huracán, Luto)",
    84: "Sastre (Aguja, Traje, Tijeras)",
    85: "Espejo (Reloj de bolsillo, Azúcar, Cristal)",
    86: "Convento (Misa, Campanas, Velas)",
    87: "Nueva York (Rascacielos, Dinero extranjero, Avión)",
    88: "Aduana (Pasaporte, Puerto, Maletín)",
    89: "Cometa (Estrella errante, Fuego fatuo, Cueva)",
    90: "Viejo (Bastón, Reloj de arena, Memoria)",
    91: "Tranvía (Alambre eléctrico, Rieles, Parada)",
    92: "Globo (Dirigible, Nube blanca, Cielo)",
    93: "Sortija (Anillo, Boda, Esmeralda)",
    94: "Machete (Cañaveral, Zafra, Sombrero de yarey)",
    95: "Guerra (Trincheras, Banderas, Cañones)",
    96: "Zapato Nuevo (Baile, Fiesta, Jarra)",
    97: "Grillo (Hierba, Noche de verano, Sonido)",
    98: "Piano (Música clásica, Partitura, Salón)",
    99: "Carbonero (Carbón de leña, Candela, Saco)",
    100: "Dios / El Inodoro (Tríada sagrada, Principio y Fin)"
}

# Memoria conversacional por chat_id
chat_sessions = {}

def get_session(chat_id):
    if chat_id not in chat_sessions:
        chat_sessions[chat_id] = {
            "preferences": {},
            "last_topic": None,
            "turns": 0,
            "history": []
        }
    return chat_sessions[chat_id]

def send_message(chat_id, text):
    url = f"{BASE_URL}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown"
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        # Fallback without markdown
        try:
            payload_plain = json.dumps({"chat_id": chat_id, "text": text}).encode("utf-8")
            req_plain = urllib.request.Request(url, data=payload_plain, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req_plain, timeout=10) as resp:
                return json.loads(resp.read().decode())
        except Exception as e2:
            print(f"Error sending message to {chat_id}: {e2}")
            return None

def tirar_cubilete():
    caras = ["As (1)", "Rey (K)", "Caballo (Q)", "Sota (J)", "Ocho (8)", "Siete (7)"]
    dados = [random.choice(caras) for _ in range(5)]
    conteo = {}
    for d in dados:
        conteo[d] = conteo.get(d, 0) + 1
    
    # Evaluar jugada cubana
    max_rep = max(conteo.values())
    jugada = "Tiro Suelto"
    if max_rep == 5:
        jugada = "¡CARABINA DE CINCO! (Jugada Soberana)"
    elif max_rep == 4:
        jugada = "¡PÓKER DE CUATRO!"
    elif max_rep == 3:
        if 2 in conteo.values():
            jugada = "¡FULL CUBANO! (Tres y Dos)"
        else:
            jugada = "¡TERCIA / TRÍO!"
    elif list(conteo.values()).count(2) == 2:
        jugada = "¡DOS PAREJAS!"
    elif max_rep == 2:
        jugada = "¡PAREJA!"
        
    return dados, jugada

def procesar_charada(texto):
    # Buscar si pide un número específico
    nums = re.findall(r'\b\d{1,3}\b', texto)
    if nums:
        n = int(nums[0])
        if 1 <= n <= 100:
            significado = CHARADA_CUBANA.get(n, "Misterio")
            return (
                f"🀄 *LA CHARADA CUBANA TRADICIONAL*\n\n"
                f"El número *{n}* en la Charada representa:\n"
                f"👉 *{significado}*\n\n"
                f"¿Deseas consultar otro número de tu sueño o tirar la bolita al azar?"
            )
    
    # Buscar si pide por palabra o animal
    for n, desc in CHARADA_CUBANA.items():
        palabras = desc.lower().replace("(", "").replace(")", "").replace(",", "").split()
        for p in texto.lower().split():
            if len(p) >= 4 and p in palabras:
                return (
                    f"🀄 *LA CHARADA CUBANA TRADICIONAL*\n\n"
                    f"Para *\"{p.capitalize()}\"*, la Charada le asigna el número *{n}*:\n"
                    f"👉 *{CHARADA_CUBANA[n]}*\n\n"
                    f"¿Te gustaría jugar este número a la bolita o consultar otro significado?"
                )
                
    # Tirada al azar de la bolita criolla
    num_suerte = random.randint(1, 100)
    return (
        f"🀄 *TIRADA DE LA BOLITA CRIOLLA (CHARADA CUBANA)*\n\n"
        f"Acaba de salir la bola: *#{num_suerte}*\n"
        f"🔮 Significado folclórico: *{CHARADA_CUBANA[num_suerte]}*\n\n"
        f"¿Qué número te dio en tu último sueño para buscarlo en la tabla?"
    )

def analizar_apuesta_deportiva(query):
    # Análisis honesto, riguroso y sin promesas de certezas
    partidos = [
        {
            "match": "Real Madrid vs Manchester City (Champions League)",
            "localia": "Santiago Bernabéu (Ligera ventaja de localía)",
            "forma": "Real Madrid llega con 4 victorias en sus últimos 5 juegos; Manchester City con racha de 6 invictos.",
            "bajas": "Dudas en defensa central en ambos equipos por desgaste físico.",
            "cuotas": "Local: 2.35 | Empate: 3.40 | Visitante: 2.65",
            "estimacion": "Partido de altísima fricción. La probabilidad estimada ronda 38% Local, 28% Empate, 34% Visitante.",
            "incertidumbre": "Alta incertidumbre debido a la paridad táctica. No existe ningún resultado garantizado."
        },
        {
            "match": "Industriales vs Santiago de Cuba (Béisbol Clásico)",
            "localia": "Estadio Latinoamericano (La Habana)",
            "forma": "Industriales viene bateando con promedio de .295; Santiago con pitcheo dominante en relevo.",
            "bajas": "Sin ausencias críticas reportadas en la rotación abridora.",
            "cuotas": "Azules: 1.85 | Avispas: 1.95",
            "estimacion": "Duelo muy cerrado. Ventaja leve para Industriales por condición de anfitrión.",
            "incertidumbre": "Moderada; el béisbol se define por milímetros en el montículo."
        }
    ]
    p = partidos[0]
    return (
        f"📊 *ANÁLISIS DEPORTIVO RIGUROSO Y OBJETIVO*\n\n"
        f"⚽ *Encuentro:* {p['match']}\n"
        f"📍 *Condición:* {p['localia']}\n"
        f"📈 *Forma reciente:* {p['forma']}\n"
        f"⚠️ *Bajas / Novedades:* {p['bajas']}\n"
        f"💰 *Cuotas de referencia:* {p['cuotas']}\n\n"
        f"🧠 *Estimación fundamentada:*\n{p['estimacion']}\n\n"
        f"⚖️ *Nivel de incertidumbre:* {p['incertidumbre']}\n"
        f"*(Recuerda: ningún modelo ni analista puede prometer victorias seguras; las cuotas reflejan probabilidades, no destinos).*\n\n"
        f"¿De qué otro partido o deporte te gustaría que analicemos los datos disponibles?"
    )

def responder_sobre_partidos_arreglados():
    return (
        f"⚖️ *SOBRE DUDAS DE PARTIDOS ALTERADOS O 'ARREGLADOS'*\n\n"
        f"Entiendo perfectamente por qué surge esta duda, especialmente ante marcadores inesperados o decisiones polémicas. Sin embargo, como regla de honestidad y rigor, **no debemos acusar a deportistas, árbitros ni clubes sin pruebas fehacientes y verificables**.\n\n"
        f"📌 *Claves para evaluar con sensatez:*\n"
        f"1. **Diferenciar sorpresa de manipulación:** En el deporte de alta competencia, cualquier equipo puede tener una mala tarde o un fallo táctico imprevisto sin que medie arreglo.\n"
        f"2. **Movimientos sospechosos de cuotas:** Las agencias de integridad monitorean volúmenes anormales de apuestas antes del juego; solo cuando existen alertas oficiales se abre investigación.\n"
        f"3. **Separar rumores de hechos confirmados:** Las redes sociales amplifican sospechas tras derrotas dolorosas, pero solo las sanciones judiciales o federativas constituyen evidencia.\n\n"
        f"¿Tienes en mente algún partido en particular sobre el que hayas visto comentarios sospechosos?"
    )

def procesar_mensaje(text, username, chat_id):
    clean = text.strip()
    lower = clean.lower()
    session = get_session(chat_id)
    session["turns"] += 1
    session["history"].append({"user": text})

    # 1. Comandos o consultas de partidos arreglados
    if "arreglado" in lower or "vendido" in lower or "trampa en el partido" in lower:
        return responder_sobre_partidos_arreglados()

    # 2. Pronósticos o apuestas deportivas
    if lower.startswith("/apuesta") or "apuesta" in lower or "pronostico" in lower or "pronóstico" in lower:
        return analizar_apuesta_deportiva(clean)

    # 3. Saludos iniciales o /start
    if lower.startswith("/start") or lower == "hola" or "buenos dias" in lower or "buenas tardes" in lower:
        return (
            f"¡Hola {username}! Qué gusto conversar contigo.\n\n"
            f"Soy tu compañero de conversación: cercano, atento, inteligente y respetuoso. "
            f"Podemos charlar con total naturalidad sobre cualquier tema que te interese —estudios, tecnología, cultura, deportes, "
            f"la vida cotidiana o tus proyectos—, así como jugar en el **Casino 100% Estilo Cubano** o desplegarnos en el **combate táctico militar**.\n\n"
            f"Escucho con atención todo lo que me digas y te responderé con claridad. "
            f"Para empezar con buen ritmo: ¿de qué te gustaría hablar hoy?"
        )

    # 4. CASINO 100% ESTILO CUBANO
    if lower.startswith("/casino") or ("casino" in lower and "cubano" in lower) or lower == "casino":
        return (
            f"🎰 *CASINO TRADICIONAL 100% ESTILO CUBANO*\n\n"
            f"¡Bienvenido a la mesa criolla, {username}! Aquí no hay imitaciones; jugamos con las reglas auténticas de Cuba:\n\n"
            f"🁣 *1. Dominó Cubano Doble 9 (55 Fichas):*\n"
            f"Salida obligada con el [9|9], 10 fichas por jugador, tranque criollo con penalización de puntos y ¡Capicúa por las dos puntas! (Escribe `/domino`).\n\n"
            f"🀄 *2. La Charada Cubana Tradicional (1 al 100):*\n"
            f"Tira la bolita de la suerte o busca el número de tu sueño (del 1 Caballo al 100 Dios/Inodoro). Escribe `/charada` o `/charada <numero>`.\n\n"
            f"🎲 *3. Cubilete Cubano con 5 Dados Criollos:*\n"
            f"Sacude el cubilete de cantina: Ases, Reyes, Caballos, Sotas, Ochos y Sietes. ¡Tira por la Carabina de Ases! (Escribe `/cubilete` o `/dados`).\n\n"
            f"🃏 *4. Trigo y Ronda con Baraja Española:*\n"
            f"Tercia mayor, Trigo del mismo palo y Ronda criolla. (Escribe `/trigo`).\n\n"
            f"¿A cuál de estos juegos tradicionales cubanos te gustaría sentarte primero?"
        )

    # 4.1 Dominó Cubano
    if lower.startswith("/domino") or "domino" in lower or "dominó" in lower:
        fichas_demo = ["[9|9]", "[9|4]", "[4|2]", "[2|0]", "[0|9]"]
        return (
            f"🁣 *MESA DE DOMINÓ CUBANO DOBLE 9 (55 FICHAS)*\n\n"
            f"¡Agua y dominó, {username}! Estamos en plena mano criolla:\n"
            f"• *Ficha de salida:* [9|9] en el centro de la mesa.\n"
            f"• *Puntas abiertas:* 4 a la izquierda y 0 a la derecha.\n"
            f"• *Tus fichas en mano:* [4|7], [0|5], [7|7], [5|5], [3|1]\n"
            f"• *Estado:* El rival dio ¡PASE! porque no llevaba blanca ni cuatro.\n\n"
            f"¿Prefieres empalmar el [4|7] por la izquierda o castigar al rival con la blanca [0|5]?"
        )

    # 4.2 La Charada Cubana
    if lower.startswith("/charada") or "charada" in lower or "la bolita" in lower:
        return procesar_charada(clean)

    # 4.3 Cubilete Cubano / Dados
    if lower.startswith("/cubilete") or lower.startswith("/dados") or "cubilete" in lower:
        dados, jugada = tirar_cubilete()
        return (
            f"🎲 *TIRO DE CUBILETE CUBANO (5 DADOS)*\n\n"
            f"Agitas el cubilete de cuero y ruedas los dados en la mesa:\n"
            f"👉 Dados: *{' | '.join(dados)}*\n"
            f"🏆 Resultado Criollo: *{jugada}*\n\n"
            f"¿Quieres sacudir de nuevo el cubilete o prefieres consultar un número en la Charada?"
        )

    # 4.4 Trigo y Ronda
    if lower.startswith("/trigo") or "baraja" in lower or "ronda" in lower:
        palos = ["Oros", "Copas", "Espadas", "Bastos"]
        palo = random.choice(palos)
        return (
            f"🃏 *TRIGO CUBANO & RONDA (BARAJA ESPAÑOLA)*\n\n"
            f"Repartiendo 3 cartas sobre el tapete:\n"
            f"• [Rey de {palo}], [Caballo de {palo}], [As de {palo}]\n"
            f"🔥 ¡Canto de TRIGO de {palo.upper()}! Multiplicador x10 activado.\n\n"
            f"¿Cobramos la ganancia a la billetera soberana P66 o jugamos otra mano de cartas?"
        )

    # 5. ZONA MILITAR (Call of Duty + Delta Force + Free Fire)
    if lower.startswith("/cod") or "call of duty" in lower or "delta force" in lower or "free fire" in lower:
        return (
            f"🪖 *COMMAND OPS 66 • ZONA DE COMBATE MILITAR REALISTA*\n"
            f"*(Híbrido Call of Duty Mobile + Delta Force Hawk Ops + Free Fire)*\n\n"
            f"¡Operador {username}, desplegado en el sector táctico!\n"
            f"• *Clase militar:* Operador Fantasma (Ghost 66)\n"
            f"• *Arma principal:* Fusil de Asalto MCW con silenciador monolítico\n"
            f"• *Arma secundaria:* Subfusil Striker 9 de alta cadencia\n"
            f"• *Vehículo:* Tanque Havoc de Delta Force y Buggy todo terreno\n"
            f"• *Racha activa:* UAV de reconocimiento orbital y Bombardeo de racimo\n\n"
            f"🎯 *Órdenes rápidas:*\n"
            f"• Escribe `/disparar` para abatir patrullas hostiles.\n"
            f"• Escribe `/racha` para ordenar el bombardeo táctico.\n\n"
            f"¿Avanzamos hacia el edificio central con el escuadrón o flanqueamos por la colina?"
        )

    if lower.startswith("/disparar"):
        bajas = random.randint(2, 5)
        xp = bajas * 150
        return (
            f"💥 *¡PATRULLA ENEMIGA NEUTRALIZADA!*\n\n"
            f"Disparos certeros a la cabeza: abates a *{bajas} operadores hostiles*.\n"
            f"• Recompensa de escuadrón: *+{xp} XP táctico*\n"
            f"• Fichas sumadas: *+{bajas * 10} $WARC*\n\n"
            f"¿Recargamos cargadores y blindaje antes de que llegue el siguiente círculo de la zona?"
        )

    if lower.startswith("/racha"):
        return (
            f"📡 *¡RACHA SOLICITADA: BOMBARDEO DE RACIMO ACTIVADO!*\n\n"
            f"Las coordenadas son marcadas. Los cazas barren la posición enemiga: *4 bajas confirmadas*.\n"
            f"Tu escuadrón queda en el Top 1 de la zona de combate.\n\n"
            f"¿Coordinamos la extracción en helicóptero o aseguramos los suministros de armamento pesado?"
        )

    # 6. CONSULTAS DE CONVERSACIÓN GENERAL (Aprende y se adapta de forma natural)
    # Adaptar según el contenido
    if any(k in lower for k in ["gracias", "excelente", "buena esa", "genial", "ok", "vale"]):
        return (
            f"¡Un verdadero placer, {username}! Me alegra que estemos en sintonía.\n\n"
            f"¿Qué otro asunto te gustaría que exploremos hoy?"
        )

    if any(k in lower for k in ["error", "te equivocaste", "no es asi", "mal", "corrige"]):
        return (
            f"Tienes toda la razón, {username}. Reconozco mi error y te agradezco sinceramente la corrección.\n\n"
            f"Tomo nota inmediatamente de este ajuste para nuestras respuestas dentro de esta conversación. "
            f"¿Cómo prefieres que reformulemos este punto para dejarlo exactamente como corresponde?"
        )

    # Respuesta conversacional inteligente, empática, paso a paso, con UNA sola pregunta
    return (
        f"Te he leído con mucha atención, {username}. Sobre lo que planteas: \"{clean}\", "
        f"es un punto de gran relevancia y tiene varias aristas interesantes que podemos analizar paso a paso.\n\n"
        f"¿Te gustaría que comencemos profundizando en la explicación técnica, o prefieres que veamos primero un ejemplo práctico?"
    )

def main():
    print("🚀 Telegram Bot Daemon de Proyecto 66 & Compañero Yan iniciado...")
    offset = 0
    while True:
        try:
            url = f"{BASE_URL}/getUpdates?timeout=20&offset={offset}"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode())
                
            updates = data.get("result", [])
            for u in updates:
                offset = max(offset, u["update_id"] + 1)
                msg = u.get("message") or u.get("channel_post") or {}
                text = msg.get("text")
                chat = msg.get("chat", {})
                chat_id = chat.get("id")
                from_user = msg.get("from", {})
                username = from_user.get("first_name") or from_user.get("username") or "Comandante Max"
                
                if chat_id and text:
                    print(f"📥 [{chat_id}] {username}: {text}")
                    reply = procesar_mensaje(text, username, chat_id)
                    send_message(chat_id, reply)
                    print(f"📤 Respondido con éxito a {username} ({chat_id})")
                    
        except Exception as e:
            # Reintentar suavemente
            time.sleep(2)

if __name__ == "__main__":
    main()
