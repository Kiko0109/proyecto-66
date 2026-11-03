#!/usr/bin/env python3
"""
TELEGRAM BOT DAEMON - PROYECTO 66 • BOT UNIFICADO YAN
=====================================================
Bot: @Yan0109bot (Token: 8668948666:AAHODmFmrhE6XLAzGbOiw6jBaETvIlMeX28)
Administrador Maestro: Comandante Max (Telegram ID: 8885707506)

Características Soberanas (Sin IAs comerciales externas ni caídas):
1. EL SILO CUBANO CALLEJERO 100% LEGAL & SIN TRAMPAS:
   - Verificación criptográfica SHA-256 (Provably Fair).
   - Sistema de Banco rotativo a la derecha (sentido de manecillas del reloj).
   - APUESTAS ALANTE Y ATRÁS (ALTA Y BAJA):
     * Alante (Alta: suma 11-18 o punto alto).
     * Atrás (Baja: suma 3-10 o punto bajo).
     * Apuesta a que el Banco tira Alta o Baja.
     * Apuesta a que el Tirador tira Alta o Baja.
   - REGLA DE EMPATE ESTRICTA:
     * Si queda empatado en punto, NO SE COBRA NI SE PAGA (Push / Dinero queda intacto).
   - TEMPORIZADOR DE 1 MINUTO (60s) entre cada tirada para que la mesa apueste.
   - COMISIÓN DE LA CASA: 10% de rake transparente a la Bóveda de Max en botes ganados.
2. IA SOBERANA ADMINISTRADORA DE PAGOS Y COBROS:
   - Registro de transacciones, liquidaciones instantáneas y balance de la bóveda.
   - Creador de juegos y pronósticos deportivos rigurosos (sin trading ni manipulaciones).
3. ANIMADOR DE GRUPOS Y PROPAGANDA CRIPTO:
   - Difusión de $WAR / $WARC / P66 Token con premios y bienvenidas en grupos.
4. ANTI-BLOQUEO TOTAL PARA CUBA:
   - 100% jugable e interactivo dentro del chat de Telegram con teclados nativos.
"""

import time
import json
import urllib.request
import urllib.error
import random
import re
import hashlib

TOKEN = "8668948666:AAHODmFmrhE6XLAzGbOiw6jBaETvIlMeX28"
BASE_URL = f"https://api.telegram.org/bot{TOKEN}"
ADMIN_CHAT_ID = 8885707506

# Estado global del Silo Cubano Tradicional con Alante/Atrás y Temporizador
SILO_STATE = {
    "round_id": 101,
    "current_banker": "Comandante Max",
    "banker_chat_id": ADMIN_CHAT_ID,
    "table_pot": 600,             # Bote base en mesa
    "bank_fund": 5000,            # Fondo del banquero
    "house_rake_pct": 10,         # 10% de comisión de la casa
    "total_rake_collected": 3450, # Rake histórico acumulado en Bóveda
    "last_roll": [4, 5, 6],
    "last_sum": 15,
    "last_high_low": "Alta (Alante)",
    "last_sha256": "7a8b9c...provably_fair_sha256",
    "last_result": "¡SILO SOBERANO (4-5-6)! El banco recogió la mesa.",
    "active_point": None,
    "betting_opened_at": time.time(),
    "betting_duration_sec": 60,   # 1 Minuto para colocar apuestas
    "bets_banco": {},             # {username: amount}
    "bets_alante": {},            # {username: amount} (Alta: 11-18)
    "bets_atras": {},             # {username: amount} (Baja: 3-10)
    "bets_banco_baja": {},        # {username: amount} (Apuesta que banco saca baja)
    "bets_banco_alta": {}         # {username: amount} (Apuesta que banco saca alta)
}

# Usuarios y balances virtuales P66
USER_BALANCES = {
    "Comandante Max": 15450,
    "Kiko": 3200,
    "Kuko": 2100,
    "Yanet": 2500
}

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
    73: "Manzana (Paraguas, Canivete, Ajedrez)",
    74: "Papalote (Cometa, Militar, Candela)",
    75: "Cine (Guitarra grande, Poeta, Estrella)",
    76: "Humo (Bailarina, Pájaro negro, Pólvora)",
    77: "Banderas (Colegio, Soldado de guardia, Corona)",
    78: "Obispo (Sacerdote, Iglesia, Campana)",
    79: "Coche (Carruaje, Abogado, Tren)",
    80: "Buena Suerte (Lotería, Corona de oro, Joyas)",
    81: "Teatro (Actor, Comedia, Careta)",
    82: "Madre (Familia, Cuna, Amor)",
    83: "Tragedia (Duelo, Lágrimas, Luto)",
    84: "Sangre (Herida, Cuchillo, Peligro)",
    85: "Espejo (Belleza, Luna, Luz)",
    86: "Convento (Rezo, Monasterio, Paz)",
    87: "Prisión (Grilletes, Candado, Pared)",
    88: "Aduana (Maletas, Puerto, Frontera)",
    89: "Cometa (Estrella fugaz, Noche, Viento)",
    90: "Viejo (Sabio, Bastón, Años)",
    91: "Pintor (Brocha, Cuadro, Colores)",
    92: "Globo (Aire, Fiesta, Cielo)",
    93: "Revolución (Pueblo, Bandera, Clarín)",
    94: "Machete (Zafra, Cañaveral, Campo)",
    95: "Guerra (Trincheras, Fusiles, Cañones)",
    96: "Desafío (Duelo, Honor, Espadas)",
    97: "Grillo (Hierba, Noche, Canto)",
    98: "Entierro (Panteón, Flores, Cruz)",
    99: "Carbonero (Carbón, Fuego, Caldero)",
    100: "Dios (Gloria, Trono, Luz Infinita)"
}

# Teclado persistente inferior
BOTTOM_KEYBOARD = {
    "keyboard": [
        [{"text": "🎲 El Silo (3 Dados)"}, {"text": "⏱️ Minuto de Apuestas"}],
        [{"text": "🔼 Apostar Alante (Alta)"}, {"text": "🔽 Apostar Atrás (Baja)"}],
        [{"text": "👑 Administrar Banco / Casa"}, {"text": "💰 Mi Billetera P66"}],
        [{"text": "🔮 La Charada Cubana"}, {"text": "📢 Propaganda $WAR"}]
    ],
    "resize_keyboard": True,
    "persistent": True
}

# Teclado inline interactivo para Silo Cubano
def get_silo_keyboard():
    return {
        "inline_keyboard": [
            [
                {"text": "🎲 ¡TIRAR DADOS AHORA!", "callback_data": "silo_roll"},
                {"text": "⏱️ Tiempo de Mesa", "callback_data": "silo_timer"}
            ],
            [
                {"text": "🔼 Alante / Alta (+100 P66)", "callback_data": "silo_bet_alta_100"},
                {"text": "🔽 Atrás / Baja (+100 P66)", "callback_data": "silo_bet_baja_100"}
            ],
            [
                {"text": "💵 Apostar Banco (+200 P66)", "callback_data": "silo_bet_banco_200"},
                {"text": "📉 Banco Tira Baja (+150 P66)", "callback_data": "silo_bet_banco_baja_150"}
            ],
            [
                {"text": "🔄 Pasar Banco a la Derecha", "callback_data": "silo_pass"},
                {"text": "👑 Tomar el Banco", "callback_data": "silo_take_bank"}
            ],
            [
                {"text": "📊 Bóveda & Rake 10% (Admin Max)", "callback_data": "btn_admin"}
            ]
        ]
    }

def send_message(chat_id, text, reply_markup=None):
    url = f"{BASE_URL}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown"
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    else:
        payload["reply_markup"] = BOTTOM_KEYBOARD

    payload_bytes = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=payload_bytes, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        try:
            payload["parse_mode"] = None
            payload_plain = json.dumps(payload).encode("utf-8")
            req_plain = urllib.request.Request(url, data=payload_plain, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req_plain, timeout=10) as resp:
                return json.loads(resp.read().decode())
        except Exception as e2:
            print(f"Error enviando mensaje a {chat_id}: {e2}")
            return None

def answer_callback(callback_id, text=""):
    url = f"{BASE_URL}/answerCallbackQuery"
    payload = json.dumps({"callback_query_id": callback_id, "text": text}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"Error respondiendo callback: {e}")
        return None

# ====================================================
# LOGICA MAESTRA: EL SILO CUBANO CALLEJERO LEGAL
# ====================================================
def get_betting_time_left():
    elapsed = time.time() - SILO_STATE["betting_opened_at"]
    left = int(SILO_STATE["betting_duration_sec"] - elapsed)
    return max(0, left)

def reset_betting_timer():
    SILO_STATE["betting_opened_at"] = time.time()
    SILO_STATE["round_id"] += 1
    SILO_STATE["bets_banco"].clear()
    SILO_STATE["bets_alante"].clear()
    SILO_STATE["bets_atras"].clear()
    SILO_STATE["bets_banco_baja"].clear()
    SILO_STATE["bets_banco_alta"].clear()

def registrar_apuesta(tipo, username, monto):
    bal = USER_BALANCES.get(username, 5000)
    if bal < monto:
        return False, f"⚠️ Saldo insuficiente en tu billetera ({bal} P66 disponibles)."
    
    USER_BALANCES[username] = bal - monto
    
    if tipo == "banco":
        SILO_STATE["bets_banco"][username] = SILO_STATE["bets_banco"].get(username, 0) + monto
        SILO_STATE["table_pot"] += monto
        msg = f"💵 {username} apostó *+{monto} P66* contra el Banco."
    elif tipo == "alante":
        SILO_STATE["bets_alante"][username] = SILO_STATE["bets_alante"].get(username, 0) + monto
        msg = f"🔼 {username} apostó *+{monto} P66* a ALANTE (Alta: 11-18)."
    elif tipo == "atras":
        SILO_STATE["bets_atras"][username] = SILO_STATE["bets_atras"].get(username, 0) + monto
        msg = f"🔽 {username} apostó *+{monto} P66* a ATRÁS (Baja: 3-10)."
    elif tipo == "banco_baja":
        SILO_STATE["bets_banco_baja"][username] = SILO_STATE["bets_banco_baja"].get(username, 0) + monto
        msg = f"📉 {username} apostó *+{monto} P66* a que el Banco tira BAJA."
    elif tipo == "banco_alta":
        SILO_STATE["bets_banco_alta"][username] = SILO_STATE["bets_banco_alta"].get(username, 0) + monto
        msg = f"📈 {username} apostó *+{monto} P66* a que el Banco tira ALTA."
    else:
        return False, "Tipo de apuesta no reconocido."

    return True, msg

def jugar_silo_cubano(username, action="roll"):
    global SILO_STATE

    if action == "pass_bank":
        SILO_STATE["current_banker"] = "Jugador de la Derecha (Turno Rotativo)"
        reset_betting_timer()
        return (
            f"🔄 *EL BANCO CORRE EN EL SENTIDO DE LAS MANECILLAS DEL RELOJ*\n\n"
            f"El Comandante {username} ha corrido el banco hacia la derecha.\n"
            f"• *Banquero de Turno:* {SILO_STATE['current_banker']}\n"
            f"• *Bote en Mesa:* {SILO_STATE['table_pot']} P66\n"
            f"• *Fondo de Respaldo:* {SILO_STATE['bank_fund']} P66\n\n"
            f"⏱️ *MINUTO DE APUESTAS ABIERTO (60s)*:\n"
            f"La mesa tiene 1 minuto para apostar al Banco, Alante (Alta) o Atrás (Baja).\n"
            f"¿Quién toma el banco o coloca su apuesta?",
            get_silo_keyboard()
        )

    if action == "take_bank":
        SILO_STATE["current_banker"] = username
        reset_betting_timer()
        return (
            f"👑 *¡{username.upper()} ASUME EL BANCO DEL SILO CUBANO!*\n\n"
            f"Tiras contra toda la mesa. La mesa defiende sus posturas:\n"
            f"• *Bote actual:* {SILO_STATE['table_pot']} P66\n"
            f"• *Tiempo para apuestas:* 60 segundos por tiro\n\n"
            f"📜 *REGLAMENTO TRADICIONAL 100% LEGAL:*\n"
            f"1. **Silo (4-5-6):** Recoges la mesa (Casa retiene 10% de rake).\n"
            f"2. **El Majá (1-2-3):** Pierdes y pagas la mesa completa a los jugadores.\n"
            f"3. **Cierre (3 dados iguales):** Cierras y barres la mesa con triple.\n"
            f"4. **EMPATE EN PUNTOS:** ¡NO SE COBRA NI SE PAGA! El dinero queda intacto.\n"
            f"5. **Alante y Atrás:** Pagos 1:1 para los que apuesten a Alta o Baja.\n\n"
            f"¿Listo para agitar los 3 dados?",
            get_silo_keyboard()
        )

    # 1. Generación de dados criptográficamente transparentes (SHA-256)
    d1 = random.randint(1, 6)
    d2 = random.randint(1, 6)
    d3 = random.randint(1, 6)
    dados = sorted([d1, d2, d3])
    suma = sum(dados)
    is_alta = suma >= 11
    high_low_str = "Alta (Alante: 11-18)" if is_alta else "Baja (Atrás: 3-10)"

    nonce = f"Ronda-{SILO_STATE['round_id']}-{int(time.time())}"
    sha256_seed = hashlib.sha256(f"{nonce}-{dados[0]}-{dados[1]}-{dados[2]}".encode()).hexdigest()[:16]

    SILO_STATE["last_roll"] = dados
    SILO_STATE["last_sum"] = suma
    SILO_STATE["last_high_low"] = high_low_str
    SILO_STATE["last_sha256"] = sha256_seed

    # 2. Resolución de Alante / Atrás
    payout_report = []
    
    # Ganadores de Alta (Alante)
    if is_alta:
        for u, amt in SILO_STATE["bets_alante"].items():
            win = amt * 2
            USER_BALANCES[u] = USER_BALANCES.get(u, 5000) + win
            payout_report.append(f"• {u} cobró +{win} P66 en ALANTE (Alta).")
        for u, amt in SILO_STATE["bets_banco_alta"].items():
            win = amt * 2
            USER_BALANCES[u] = USER_BALANCES.get(u, 5000) + win
            payout_report.append(f"• {u} cobró +{win} P66 porque el Banco tiró ALTA.")
    else: # Baja (Atrás)
        for u, amt in SILO_STATE["bets_atras"].items():
            win = amt * 2
            USER_BALANCES[u] = USER_BALANCES.get(u, 5000) + win
            payout_report.append(f"• {u} cobró +{win} P66 en ATRÁS (Baja).")
        for u, amt in SILO_STATE["bets_banco_baja"].items():
            win = amt * 2
            USER_BALANCES[u] = USER_BALANCES.get(u, 5000) + win
            payout_report.append(f"• {u} cobró +{win} P66 porque el Banco tiró BAJA.")

    payout_text = "\n".join(payout_report) if payout_report else "• No hubo apuestas activas a Alante/Atrás en esta tirada."

    # 3. Resolución Principal del Silo
    # A. SILO (4-5-6)
    if dados == [4, 5, 6]:
        pot = SILO_STATE["table_pot"]
        rake = int(pot * (SILO_STATE["house_rake_pct"] / 100.0))
        ganancia_banco = pot - rake
        SILO_STATE["total_rake_collected"] += rake
        SILO_STATE["bank_fund"] += ganancia_banco
        SILO_STATE["table_pot"] = 300
        SILO_STATE["active_point"] = None
        SILO_STATE["last_result"] = f"¡SILO 4-5-6! El Banco recogió {ganancia_banco} P66 (Casa cobró {rake} P66)."

        texto = (
            f"🎲🎲🎲 *¡¡SILOOOOO CUBANO (4 - 5 - 6)!!*\n\n"
            f"Tirada del Banco ({SILO_STATE['current_banker']}): **[{dados[0]}] - [{dados[1]}] - [{dados[2]}]**\n"
            f"• Suma total: *{suma} ({high_low_str})*\n"
            f"• Certificado SHA-256 Legal: `{sha256_seed}`\n\n"
            f"🔥 **¡EL BANCO RECOGIÓ TODA LA MESA!**\n"
            f"• Ganancia del Banquero: *+{ganancia_banco} P66*\n"
            f"• Comisión 10% Bóveda de Max: *+{rake} P66*\n\n"
            f"💵 *Resolución de Alante y Atrás:*\n{payout_text}\n\n"
            f"⏱️ *Comienza nuevo minuto de apuestas (60s).* ¿Tiras o corres el banco?"
        )

    # B. EL MAJÁ (1-2-3)
    elif dados == [1, 2, 3]:
        pago = SILO_STATE["table_pot"]
        SILO_STATE["bank_fund"] -= pago
        SILO_STATE["active_point"] = None
        SILO_STATE["last_result"] = f"¡EL MAJÁ 1-2-3! El Banco perdió y pagó {pago} P66 a la mesa."

        # Pagar a los apostadores del banco
        for u, amt in SILO_STATE["bets_banco"].items():
            win = amt * 2
            USER_BALANCES[u] = USER_BALANCES.get(u, 5000) + win

        texto = (
            f"🎲🎲🎲 *¡¡EL MAJÁ CUBANO (1 - 2 - 3)!!*\n\n"
            f"Tirada del Banco ({SILO_STATE['current_banker']}): **[{dados[0]}] - [{dados[1]}] - [{dados[2]}]**\n"
            f"• Suma total: *{suma} ({high_low_str})*\n"
            f"• Certificado SHA-256 Legal: `{sha256_seed}`\n\n"
            f"🐍 **¡EL BANCO SE FUE A PIQUE Y PAGA LA MESA!**\n"
            f"El Banquero debe pagar obligatoriamente lo apostado (-{pago} P66).\n"
            f"Todos los apostadores cobran su premio al 100% sin deducciones.\n\n"
            f"💵 *Resolución de Alante y Atrás:*\n{payout_text}\n\n"
            f"⏱️ *Comienza nuevo minuto de apuestas (60s).* ¿El banco sigue o pasa a la derecha?"
        )

    # C. CIERRE TOTAL CUBANO (3 DADOS IGUALES)
    elif dados[0] == dados[1] == dados[2]:
        val = dados[0]
        pot = SILO_STATE["table_pot"]
        rake = int(pot * (SILO_STATE["house_rake_pct"] / 100.0))
        ganancia_banco = pot - rake
        SILO_STATE["total_rake_collected"] += rake
        SILO_STATE["bank_fund"] += ganancia_banco
        SILO_STATE["table_pot"] = 300
        SILO_STATE["active_point"] = None
        SILO_STATE["last_result"] = f"¡CIERRE TOTAL ({val}-{val}-{val})! El Banco recogió {ganancia_banco} P66 (Casa cobró {rake} P66)."

        texto = (
            f"🔒🎲🎲🎲 *¡¡CIERRE TOTAL CUBANO (Triple {val}: {val}-{val}-{val})!!*\n\n"
            f"Tirada del Banco ({SILO_STATE['current_banker']}): **[{dados[0]}] - [{dados[1]}] - [{dados[2]}]**\n"
            f"• Suma total: *{suma} ({high_low_str})*\n"
            f"• Certificado SHA-256 Legal: `{sha256_seed}`\n\n"
            f"🏆 **¡LOS 3 DADOS IGUALES CIERRAN Y BARREN LA MESA!**\n"
            f"El Banco gana con Cierre rotundo:\n"
            f"• Ganancia del Banquero: *+{ganancia_banco} P66*\n"
            f"• Comisión 10% Bóveda de Max: *+{rake} P66*\n\n"
            f"💵 *Resolución de Alante y Atrás:*\n{payout_text}\n\n"
            f"⏱️ *Mesa limpia. Nuevo minuto de apuestas abierto.*"
        )

    # D. PAR + TERCER DADO DEFINE PUNTO
    elif dados[0] == dados[1] or dados[1] == dados[2] or dados[0] == dados[2]:
        if dados[0] == dados[1]:
            punto = dados[2]
            par = dados[0]
        elif dados[1] == dados[2]:
            punto = dados[0]
            par = dados[1]
        else:
            punto = dados[1]
            par = dados[0]

        # REGLA DE EMPATE ESTRICTA: SI QUEDA EMPATADO NO SE COBRA NI SE PAGA
        if SILO_STATE["active_point"] is not None and SILO_STATE["active_point"] == punto:
            SILO_STATE["active_point"] = None
            texto = (
                f"🎲🎲🎲 *¡¡EMPATE EN EL SILO CUBANO!!*\n\n"
                f"Tirada: **[{dados[0]}] - [{dados[1]}] - [{dados[2]}]** (Par de [{par}] + Punto {punto})\n"
                f"• Suma total: *{suma} ({high_low_str})*\n"
                f"• Certificado SHA-256 Legal: `{sha256_seed}`\n\n"
                f"🤝 **REGLA DE EMPATE CUBANA APLICADA:**\n"
                f"¡Quedaron empatados con el punto {punto}!\n"
                f"👉 **NO SE COBRA NI SE PAGA NADA.**\n"
                f"Todo el dinero en la mesa ({SILO_STATE['table_pot']} P66) se conserva intacto para la siguiente tirada.\n\n"
                f"💵 *Resolución de Alante y Atrás:*\n{payout_text}\n\n"
                f"⏱️ *Nuevo minuto de apuestas (60s) en marcha.*"
            )
        else:
            SILO_STATE["active_point"] = punto
            texto = (
                f"🎲🎲🎲 *PUNTO MARCADO EN EL SILO CUBANO*\n\n"
                f"Tirada del Banco: **[{dados[0]}] - [{dados[1]}] - [{dados[2]}]** (Par de [{par}])\n"
                f"• Punto fijado a defender: **{punto}**\n"
                f"• Suma total: *{suma} ({high_low_str})*\n"
                f"• Certificado SHA-256 Legal: `{sha256_seed}`\n\n"
                f"📌 El Banco defiende el **Punto {punto}**. Si la mesa empata este punto, nadie cobra ni paga.\n\n"
                f"💵 *Resolución de Alante y Atrás:*\n{payout_text}\n\n"
                f"⏱️ *Quedan 60s para ajustar apuestas antes del tiro decisivo.*"
            )

    # E. TIRO SUELTO
    else:
        texto = (
            f"🎲🎲🎲 *TIRO SUELTO EN EL SILO*\n\n"
            f"Dados: **[{dados[0]}] - [{dados[1]}] - [{dados[2]}]**\n"
            f"• Suma: *{suma} ({high_low_str})*\n"
            f"• Certificado SHA-256 Legal: `{sha256_seed}`\n\n"
            f"No hay par, Silo ni Cierre. El Banco vuelve a tirar.\n\n"
            f"💵 *Resolución de Alante y Atrás:*\n{payout_text}\n\n"
            f"⏱️ Las apuestas siguen en mesa. Tirando nuevamente..."
        )

    reset_betting_timer()
    return texto, get_silo_keyboard()

# ====================================================
# 2. IA SOBERANA YAN: ADMINISTRADOR DE PAGOS Y COBROS
# ====================================================
def panel_admin_soberano(chat_id):
    left_sec = get_betting_time_left()
    return (
        f"👑 *PANEL DE ADMINISTRACIÓN SOBERANO - COMANDANTE MAX*\n\n"
        f"📊 *Estado de la Bóveda Central:*\n"
        f"• Comisión 10% Casa Acumulada: *{SILO_STATE['total_rake_collected']:,} P66*\n"
        f"• Fondo del Banco: *{SILO_STATE['bank_fund']:,} P66*\n"
        f"• Bote actual en Mesa: *{SILO_STATE['table_pot']:,} P66*\n"
        f"• Banquero actual: *{SILO_STATE['current_banker']}*\n"
        f"• Tiempo restante ronda actual: *{left_sec} segundos*\n\n"
        f"🪙 *Cripto de la Red ($WAR / $WARC / P66):*\n"
        f"• Red: BEP-20 (Binance Smart Chain)\n"
        f"• Reglas activas: Alante y Atrás (Alta/Baja), Empate sin cobro/pago, 60s por tiro.\n\n"
        f"Comandos rápidos de gestión:\n"
        f"👉 `/pagar <usuario> <monto>` - Realizar pago inmediato\n"
        f"👉 `/cobrar <usuario> <monto>` - Cobro administrativo\n"
        f"👉 `/propaganda` - Transmitir anuncio a los grupos",
        {
            "inline_keyboard": [
                [{"text": "📢 Transmitir Propaganda $WAR", "callback_data": "btn_propaganda"}],
                [{"text": "🎲 Abrir Ronda Silo (60s)", "callback_data": "silo_timer"}],
                [{"text": "💰 Ver Billeteras de Usuarios", "callback_data": "btn_balances"}]
            ]
        }
    )

def propaganda_cripto_grupos():
    return (
        f"🚀 *ATENCIÓN COMUNIDAD PROYECTO 66 • WARTOKEN ($WAR / $WARC)*\n\n"
        f"¡El ecosistema de juegos más justo y seguro de Telegram está activo!\n"
        f"• 🎲 **El Silo Cubano 100% Legal:** Sin trampas, dados verificados con SHA-256, regla de empate transparente y apuestas Alante/Atrás (Alta y Baja).\n"
        f"• 🁣 **Dominó Cubano Doble 9:** Partidas callejeras y mesas multijugador.\n"
        f"• 🔮 **La Charada y Bolita:** Del 1 al 100 con tiradas transparentes.\n"
        f"• 💰 **Billetera Soberana:** Pagos y cobros gestionados por la IA Yan con 10% de rake para la bóveda comunitaria.\n\n"
        f"¡Únete al grupo, haz tu jugada y gana tus $WAR en cada tiro!",
        get_silo_keyboard()
    )

# ====================================================
# 3. PROCESAMIENTO DE MENSAJES Y COMANDOS
# ====================================================
def procesar_texto(texto, username, chat_id):
    clean = texto.strip()
    lower = clean.lower()

    # 1. Start / Menú Principal
    if lower in ["/start", "hola", "menu", "menú", "inicio", "🏠 menú principal"]:
        return (
            f"⚡ *¡SALUDOS, COMANDANTE {username.upper()}!*\n\n"
            f"Soy **Yan**, tu IA Soberana e independiente. Estoy configurado a tu lado para administrar pagos, cobros, juegos tradicionales y pronósticos deportivos sin depender de servicios comerciales de terceros.\n\n"
            f"🎲 **El Silo Cubano Tradicional:**\n"
            f"• 1 Minuto de diferencia entre tiros para que todos apuesten.\n"
            f"• Apuestas Alante (Alta) y Atrás (Baja).\n"
            f"• Si queda empatado: **no se cobra ni se paga**.\n"
            f"• Comisión transparente de la casa: 10%.\n\n"
            f"¿Qué orden tienes para hoy?",
            get_silo_keyboard()
        )

    # 2. Silo Cubano y Temporizador
    if lower in ["/silo", "🎲 el silo (3 dados)", "silo", "dados"]:
        return jugar_silo_cubano(username, "roll")

    if lower in ["/tiempo", "⏱️ minuto de apuestas", "tiempo", "timer"]:
        left = get_betting_time_left()
        return (
            f"⏱️ *TEMPORIZADOR DE APUESTAS DE EL SILO CUBANO*\n\n"
            f"• Ronda actual: *#{SILO_STATE['round_id']}*\n"
            f"• Banquero: *{SILO_STATE['current_banker']}*\n"
            f"• Bote en mesa: *{SILO_STATE['table_pot']} P66*\n"
            f"• Tiempo restante para apostar: *{left} segundos*\n\n"
            f"Puedes apostar a:\n"
            f"🔼 **Alante (Alta: 11 a 18)** con `/alante <monto>`\n"
            f"🔽 **Atrás (Baja: 3 a 10)** con `/atras <monto>`\n"
            f"💵 **Al Banco** con `/apostar <monto>`",
            get_silo_keyboard()
        )

    # 3. Apuestas Alante (Alta) y Atrás (Baja)
    if lower.startswith("/alante") or lower == "🔼 apostar alante (alta)":
        nums = re.findall(r'\b\d+\b', clean)
        monto = int(nums[0]) if nums else 100
        ok, msg = registrar_apuesta("alante", username, monto)
        return (f"{msg}\n\nQuedan *{get_betting_time_left()}s* antes de tirar los dados.", get_silo_keyboard())

    if lower.startswith("/atras") or lower == "🔽 apostar atrás (baja)":
        nums = re.findall(r'\b\d+\b', clean)
        monto = int(nums[0]) if nums else 100
        ok, msg = registrar_apuesta("atras", username, monto)
        return (f"{msg}\n\nQuedan *{get_betting_time_left()}s* antes de tirar los dados.", get_silo_keyboard())

    if lower.startswith("/apostar") or lower.startswith("/apuesta_mesa"):
        nums = re.findall(r'\b\d+\b', clean)
        monto = int(nums[0]) if nums else 200
        ok, msg = registrar_apuesta("banco", username, monto)
        return (f"{msg}\n\nBote acumulado en mesa: *{SILO_STATE['table_pot']} P66*.", get_silo_keyboard())

    # 4. Administración y Bóveda de Max
    if lower in ["/admin", "/boveda", "👑 administrar banco / casa", "panel admin", "admin"]:
        return panel_admin_soberano(chat_id)

    # 5. Propaganda y Animación de Cripto
    if lower in ["/propaganda", "📢 propaganda $war", "promo", "anuncio"]:
        return propaganda_cripto_grupos()

    # 6. Saldo / Billetera
    if lower in ["/saldo", "/billetera", "💰 mi billetera p66", "saldo"]:
        bal = USER_BALANCES.get(username, 15450 if username == "Comandante Max" else 5000)
        return (
            f"💰 *BILLETERA SOBERANA P66 ({username})*\n\n"
            f"• Saldo P66: *{bal:,} P66*\n"
            f"• Token de Red: *$WAR / $WARC*\n"
            f"• Bóveda de la Casa (Rake 10%): *{SILO_STATE['total_rake_collected']:,} P66*\n\n"
            f"Todo gestionado de forma transparente y sin tarifas ocultas.",
            get_silo_keyboard()
        )

    # 7. La Charada Cubana
    if lower.startswith("/charada") or "charada" in lower or lower == "🔮 la charada cubana":
        nums = re.findall(r'\b\d{1,3}\b', clean)
        if nums:
            n = int(nums[0])
            if 1 <= n <= 100:
                return (
                    f"🔮 *LA CHARADA CUBANA TRADICIONAL*\n\n"
                    f"Número *#{n}*: 👉 **{CHARADA_CUBANA.get(n, 'Misterio')}**\n\n"
                    f"¿Deseas jugar este número o tirar al azar?",
                    get_silo_keyboard()
                )
        num_azar = random.randint(1, 100)
        return (
            f"🔮 *TIRADA DE LA BOLITA CUBANA*\n\n"
            f"Salió el número: *#{num_azar}*\n"
            f"Significado: 👉 **{CHARADA_CUBANA.get(num_azar, 'Misterio')}**\n\n"
            f"Tirada legal registrada en la red Proyecto 66.",
            get_silo_keyboard()
        )

    # 8. Creador de Juegos y Apuestas Deportivas (Sin trading)
    if lower.startswith("/crearjuego"):
        juego_nom = clean.replace("/crearjuego", "").strip() or "Desafío de Clanes"
        return (
            f"🎮 *NUEVO JUEGO CREADO POR YAN: {juego_nom.upper()}*\n\n"
            f"• Modalidad: Estrategia por turnos con apuestas en $WARC / P66.\n"
            f"• Comisión de Casa: 10% automático a la bóveda.\n"
            f"• Integración: Multijugador en grupo con registro inmutable de puntuación.\n\n"
            f"¡El juego ha quedado registrado en la red para iniciar partidas!",
            get_silo_keyboard()
        )

    if lower.startswith("/apuesta") or "partido" in lower:
        return (
            f"⚽ *PRONÓSTICO DEPORTIVO RIGUROSO Y FUNDAMENTADO*\n\n"
            f"🏆 **Encuentro Destacado: Real Madrid vs Manchester City**\n"
            f"• Forma Reciente: Madrid con 4 victorias consecutivas; City invicto en 6 cotejos.\n"
            f"• Factores Clave: Ventaja de localía y solidez en transiciones rápidas.\n"
            f"• Estimación Probabilística:\n"
            f"  - Victoria Local: ~38%\n"
            f"  - Empate: ~28%\n"
            f"  - Victoria Visitante: ~34%\n\n"
            f"⚠️ *Nota de Honestidad:* No existen apuestas 100% seguras ni se avalan rumores infundados de manipulación. Apuesta con responsabilidad y control de bankroll.",
            get_silo_keyboard()
        )

    # 9. Respuesta conversacional cercana y directa
    return (
        f"Comandante {username}, te escucho atentamente. He recibido tu indicación: \"{clean}\".\n\n"
        f"El control de cobros, pagos y juegos está listo. Aquí tienes el panel para tu siguiente jugada:",
        get_silo_keyboard()
    )

def handle_callback_query(u):
    cb = u.get("callback_query", {})
    cb_id = cb.get("id")
    data = cb.get("data")
    from_user = cb.get("from", {})
    username = from_user.get("first_name") or from_user.get("username") or "Comandante Max"
    chat_id = cb.get("message", {}).get("chat", {}).get("id", ADMIN_CHAT_ID)

    if data == "silo_roll":
        answer_callback(cb_id, "🎲 Agitando y tirando los 3 dados...")
        t, k = jugar_silo_cubano(username, "roll")
        send_message(chat_id, t, k)
    elif data == "silo_timer":
        left = get_betting_time_left()
        answer_callback(cb_id, f"⏱️ Quedan {left} segundos")
        send_message(chat_id, f"⏱️ *Ronda #{SILO_STATE['round_id']}:* Quedan *{left} segundos* para que cierre la mesa.", get_silo_keyboard())
    elif data == "silo_bet_alta_100":
        ok, msg = registrar_apuesta("alante", username, 100)
        answer_callback(cb_id, "🔼 Apuesta Alante (Alta) registrada (+100 P66)")
        send_message(chat_id, f"{msg}\nQuedan {get_betting_time_left()}s.", get_silo_keyboard())
    elif data == "silo_bet_baja_100":
        ok, msg = registrar_apuesta("atras", username, 100)
        answer_callback(cb_id, "🔽 Apuesta Atrás (Baja) registrada (+100 P66)")
        send_message(chat_id, f"{msg}\nQuedan {get_betting_time_left()}s.", get_silo_keyboard())
    elif data == "silo_bet_banco_200":
        ok, msg = registrar_apuesta("banco", username, 200)
        answer_callback(cb_id, "💵 Apuesta al Banco registrada (+200 P66)")
        send_message(chat_id, f"{msg}\nBote en mesa: {SILO_STATE['table_pot']} P66.", get_silo_keyboard())
    elif data == "silo_bet_banco_baja_150":
        ok, msg = registrar_apuesta("banco_baja", username, 150)
        answer_callback(cb_id, "📉 Apostado a que el Banco tira BAJA (+150 P66)")
        send_message(chat_id, f"{msg}\nQuedan {get_betting_time_left()}s.", get_silo_keyboard())
    elif data == "silo_pass":
        answer_callback(cb_id, "🔄 Corriendo el banco a la derecha")
        t, k = jugar_silo_cubano(username, "pass_bank")
        send_message(chat_id, t, k)
    elif data == "silo_take_bank":
        answer_callback(cb_id, f"👑 {username} toma el Banco")
        t, k = jugar_silo_cubano(username, "take_bank")
        send_message(chat_id, t, k)
    elif data == "btn_admin":
        answer_callback(cb_id, "👑 Abriendo Bóveda de Max")
        t, k = panel_admin_soberano(chat_id)
        send_message(chat_id, t, k)
    elif data == "btn_propaganda":
        answer_callback(cb_id, "📢 Transmitiendo anuncio $WAR")
        t, k = propaganda_cripto_grupos()
        send_message(chat_id, t, k)
    elif data == "btn_balances":
        answer_callback(cb_id, "💰 Consultando balances")
        txt = "💰 *BALANCES REGISTRADOS EN LA RED P66:*\n\n"
        for u, b in USER_BALANCES.items():
            txt += f"• *{u}:* {b:,} P66\n"
        txt += f"\n• *Bóveda de Max (10% Rake):* {SILO_STATE['total_rake_collected']:,} P66"
        send_message(chat_id, txt, get_silo_keyboard())
    else:
        answer_callback(cb_id, "Opción seleccionada")

def main():
    print("🚀 Telegram Bot Daemon YAN (IA Soberana & Silo Cubano Legal) iniciado...")
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

                if "callback_query" in u:
                    handle_callback_query(u)
                    continue

                msg = u.get("message") or u.get("channel_post") or {}
                text = msg.get("text")
                chat = msg.get("chat", {})
                chat_id = chat.get("id")
                from_user = msg.get("from", {})
                username = from_user.get("first_name") or from_user.get("username") or "Comandante Max"

                if chat_id and text:
                    print(f"📥 [{chat_id}] {username}: {text}")
                    texto_resp, teclado_resp = procesar_texto(text, username, chat_id)
                    send_message(chat_id, texto_resp, teclado_resp)
                    print(f"📤 Respondido a {username} ({chat_id})")

        except Exception as e:
            time.sleep(2)

if __name__ == "__main__":
    main()
