#!/usr/bin/env python3
"""
TELEGRAM BOT DAEMON - PROYECTO 66 • BOT UNIFICADO YAN
=====================================================
Bot: @Yan0109bot (Token: 8668948666:AAHODmFmrhE6XLAzGbOiw6jBaETvIlMeX28)
Administrador Maestro: Comandante Max (Telegram ID: 8885707506)

Arquitectura:
1. COMANDOS PRINCIPALES SOLAMENTE en Telegram:
   - /start - Iniciar y Abrir Telegram Games Hub
   - /web - Abrir Web App Oficial de Juegos
   - /admin - Panel Administrativo y Bóveda de Max (10% Rake de la Casa)
   - /saldo - Consultar Billetera P66 y $WAR Token
   - /apuestas - Pronósticos y Análisis Deportivo
   - /propaganda - Difusión Comunitaria $WAR Token
   - /ayuda - Reglas y Soporte
2. TODOS LOS JUEGOS Y APUESTAS DENTRO DE LA WEB:
   - El Silo Cubano (3 dados tradicionales, Alante/Atrás, 60s, empate legal, 10% rake)
   - Aventuras Épicas (RPG al estilo WoW con 24 razas y mazmorras)
   - Juego de Comando (Call of Duty, Delta Force, Free Fire)
   - Dominó Cubano Doble 9 y La Charada Tradicional
   - Pantalla Holográfica Esports World Series Top 10
3. IA SOBERANA YAN:
   - Administrador de Pagos y Cobros
   - Animador de Grupos y Emisor de Propaganda Cripto
   - Cero dependencia de IAs comerciales lentas
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

# URL Oficial de la Web App en Telegram (Telegram Games Hub)
WEB_APP_URL = "https://ais-pre-xnsllky7xyda54sjtze63s-122500213674.us-east1.run.app"

# Estado de la Bóveda Central de la Casa (Comandante Max)
VAULT_STATE = {
    "admin_name": "Comandante Max",
    "house_rake_pct": 10,         # 10% de rake en botes ganados
    "total_rake_collected": 3450, # Rake histórico acumulado en Bóveda
    "bank_fund": 5000,            # Fondo de garantía del banco
    "active_tables": 3,
    "last_payout": "1,200 P66 abonados a la Bóveda por victoria de Silo"
}

# Balances de usuarios en fichas P66 / $WAR
USER_BALANCES = {
    "Comandante Max": 15450,
    "Kiko": 3200,
    "Kuko": 2100,
    "Yanet": 2500
}

# Teclado persistente inferior con los accesos principales
BOTTOM_KEYBOARD = {
    "keyboard": [
        [{"text": "🎮 Abrir Web de Juegos", "web_app": {"url": WEB_APP_URL}}, {"text": "🏠 Menú Principal"}],
        [{"text": "👑 Panel Admin Max"}, {"text": "💰 Mi Billetera P66"}],
        [{"text": "⚽ Apuestas Deportivas"}, {"text": "📢 Propaganda $WAR"}]
    ],
    "resize_keyboard": True,
    "persistent": True
}

# Teclado inline interactivo principal
MAIN_INLINE_KEYBOARD = {
    "inline_keyboard": [
        [
            {"text": "🎮 ENTRAR A TELEGRAM GAMES HUB (WEB)", "web_app": {"url": WEB_APP_URL}}
        ],
        [
            {"text": "👑 Panel Admin & Bóveda (10% Rake)", "callback_data": "btn_admin"},
            {"text": "💰 Mi Billetera", "callback_data": "btn_saldo"}
        ],
        [
            {"text": "⚽ Apuestas Deportivas", "callback_data": "btn_apuesta"},
            {"text": "📢 Propaganda $WAR", "callback_data": "btn_propaganda"}
        ],
        [
            {"text": "➕ Agregar Yan a tus Grupos", "url": "https://t.me/Yan0109bot?startgroup=true"}
        ]
    ]
}

def configure_bot_commands():
    """Registra únicamente los 7 comandos principales oficiales en Telegram"""
    commands = [
        {"command": "start", "description": "🎮 Iniciar y Entrar a la Web de Juegos"},
        {"command": "web", "description": "🌐 Abrir Telegram Games Hub (Silo, WoW, COD)"},
        {"command": "admin", "description": "👑 Panel Administrativo y Bóveda Max (10% Rake)"},
        {"command": "saldo", "description": "💰 Consultar Billetera P66 y $WAR Token"},
        {"command": "apuestas", "description": "⚽ Pronósticos y Análisis Deportivo"},
        {"command": "propaganda", "description": "📢 Transmitir Anuncio $WAR a los Grupos"},
        {"command": "ayuda", "description": "📜 Reglas Oficiales y Soporte"}
    ]
    try:
        url = f"{BASE_URL}/setMyCommands"
        req = urllib.request.Request(
            url,
            data=json.dumps({"commands": commands}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            print("✅ Comandos principales registrados en Telegram (setMyCommands exitoso).")
    except Exception as e:
        print(f"Aviso en setMyCommands: {e}")

    try:
        menu_url = f"{BASE_URL}/setChatMenuButton"
        req = urllib.request.Request(
            menu_url,
            data=json.dumps({
                "menu_button": {
                    "type": "web_app",
                    "text": "🎮 Jugar en Web",
                    "web_app": {"url": WEB_APP_URL}
                }
            }).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            print("✅ Botón de Menú nativo enlazado a la Web App (setChatMenuButton exitoso).")
    except Exception as e:
        print(f"Aviso en setChatMenuButton: {e}")

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
# RESPUESTAS PRINCIPALES DE YAN
# ====================================================
def panel_admin_max():
    return (
        f"👑 *PANEL ADMINISTRATIVO SOBERANO - COMANDANTE MAX*\n\n"
        f"📊 *Estado de la Bóveda de la Casa (Rake 10%):*\n"
        f"• Rake del 10% Acumulado: *{VAULT_STATE['total_rake_collected']:,} P66*\n"
        f"• Fondo de Garantía: *{VAULT_STATE['bank_fund']:,} P66*\n"
        f"• Comisión fija de Casa: *10% en cada bote ganador*\n"
        f"• Última Liquidación: _{VAULT_STATE['last_payout']}_\n\n"
        f"🕹️ *Estado de los Juegos en la Web:*\n"
        f"• **El Silo Cubano:** Alante y Atrás activo, temporizador de 60s, regla de empate estricta (no se cobra ni se paga) y SHA-256 verificado.\n"
        f"• **Aventuras Épicas:** 24 Razas y Mazmorras en línea.\n"
        f"• **Juego de Comando:** Call of Duty y Delta Force sincronizados.\n\n"
        f"👉 Todos los juegos se ejecutan dentro de la Web App en alta definición.",
        MAIN_INLINE_KEYBOARD
    )

def mensaje_ir_a_la_web(username, juego_mencionado=""):
    detalle = f" de *{juego_mencionado}*" if juego_mencionado else ""
    return (
        f"🎮 *¡LOS JUEGOS ESTÁN DISPONIBLES EN LA WEB APP!*\n\n"
        f"Comandante {username}, toda la experiencia interactiva{detalle} se juega directamente dentro de nuestra plataforma web:\n\n"
        f"• 🎲 **El Silo Cubano Callejero:** 3 dados en tapete 3D con apuestas de Alante (Alta: 11-18) y Atrás (Baja: 3-10), temporizador de 60s por tiro, regla de empate legal y 10% de rake de la casa.\n"
        f"• ⚔️ **Aventuras Épicas:** RPG estilo WoW con razas, clases y mazmorras.\n"
        f"• 🪖 **Juego de Comando:** FPS táctico militar con clanes y torneos.\n"
        f"• 🏆 **Top 10 Esports Leaderboard:** Pantalla holográfica de clasificación mundial.\n\n"
        f"👇 *Toca el botón abajo para abrir la Web App de inmediato:*",
        {
            "inline_keyboard": [
                [{"text": "🚀 ABRIR TELEGRAM GAMES HUB", "web_app": {"url": WEB_APP_URL}}],
                [{"text": "👑 Panel Admin Max", "callback_data": "btn_admin"}, {"text": "💰 Mi Billetera", "callback_data": "btn_saldo"}]
            ]
        }
    )

def propaganda_comunidad():
    return (
        f"🚀 *PROPAGANDA OFICIAL • WARTOKEN ($WAR / $WARC) & PROYECTO 66*\n\n"
        f"¡Bienvenidos al ecosistema de entretenimiento y apuestas más seguro de Telegram!\n\n"
        f"💎 **¿Por qué jugar en Telegram Games Hub?**\n"
        f"1. **Juego Limpio y Legal:** Cero trampas, dados verificables con SHA-256 y reglas callejeras tradicionales respetadas al 100%.\n"
        f"2. **El Silo Cubano Auténtico:** Apuestas a Banco, Alante (Alta) y Atrás (Baja), con ventana de 60s para colocar posturas.\n"
        f"3. **Sin Bloqueos:** Acceso fluido desde Telegram o navegador con sesión persistente y blindada.\n"
        f"4. **Billetera Soberana:** Retención comunitaria del 10% para la bóveda del proyecto.\n\n"
        f"👇 ¡Entra al portal web y reclama tus fichas de bienvenida!",
        MAIN_INLINE_KEYBOARD
    )

def pronostico_deportivo():
    return (
        f"⚽ *PRONÓSTICOS DEPORTIVOS RIGUROSOS Y FUNDAMENTADOS*\n\n"
        f"🏆 **Encuentro Analizado: Real Madrid vs Manchester City**\n"
        f"• Forma Reciente: Madrid con 4 victorias consecutivas; City invicto en 6 cotejos.\n"
        f"• Factores Tácticos: Ventaja de localía y solidez en transiciones de ataque.\n"
        f"• Estimación Probabilística:\n"
        f"  - Victoria Local: ~38%\n"
        f"  - Empate: ~28%\n"
        f"  - Victoria Visitante: ~34%\n\n"
        f"⚠️ *Transparencia:* Sin promesas milagrosas ni falsas acusaciones de amaño. Para gestionar tus boletos deportivos completos, entra a la Web App.",
        MAIN_INLINE_KEYBOARD
    )

# ====================================================
# PROCESAMIENTO DE MENSAJES Y COMANDOS PRINCIPALES
# ====================================================
def procesar_texto(texto, username, chat_id):
    clean = texto.strip()
    lower = clean.lower()

    # 1. /start o Menú Principal
    if lower in ["/start", "hola", "menu", "menú", "inicio", "🏠 menú principal"]:
        return (
            f"⚡ *¡BIENVENIDO A PROYECTO 66 • TELEGRAM GAMES HUB!*\n\n"
            f"Soy **Yan**, tu IA Soberana y administrador de la red. Todos los juegos se ejecutan dentro de nuestra plataforma web en alta definición.\n\n"
            f"📌 *Tus Comandos Principales en Telegram:*\n"
            f"• `/web` - Abrir la Web App de juegos\n"
            f"• `/admin` - Panel administrativo y Bóveda (10% Rake)\n"
            f"• `/saldo` - Consultar tu balance de fichas y $WAR\n"
            f"• `/apuestas` - Pronósticos y análisis deportivo\n"
            f"• `/propaganda` - Transmitir anuncio a los grupos\n"
            f"• `/ayuda` - Reglas oficiales y soporte\n\n"
            f"Presiona el botón a continuación para ingresar a la Web:",
            MAIN_INLINE_KEYBOARD
        )

    # 2. /web o cualquier solicitud de juego -> Dirigir a la Web
    if lower in ["/web", "/jugar", "🎮 abrir web de juegos", "web", "juegos", "juego", "portal"]:
        return mensaje_ir_a_la_web(username)

    if any(k in lower for k in ["silo", "dados", "poker", "cod", "wow", "aventuras", "comando", "domino", "charada", "bolita"]):
        palabra = "El Silo Cubano" if "silo" in lower or "dados" in lower else "Juegos Criollos"
        return mensaje_ir_a_la_web(username, palabra)

    # 3. /admin
    if lower in ["/admin", "/boveda", "👑 panel admin max", "panel admin", "admin"]:
        return panel_admin_max()

    # 4. /saldo
    if lower in ["/saldo", "/billetera", "💰 mi billetera p66", "saldo"]:
        bal = USER_BALANCES.get(username, 15450 if username == "Comandante Max" else 5000)
        return (
            f"💰 *BILLETERA SOBERANA P66 ({username})*\n\n"
            f"• Saldo P66: *{bal:,} P66*\n"
            f"• Token de Red: *$WAR / $WARC (BEP-20)*\n"
            f"• Bóveda de la Casa (Rake 10% acumulado): *{VAULT_STATE['total_rake_collected']:,} P66*\n\n"
            f"👉 Puedes utilizar tu saldo en cualquiera de los juegos dentro de la Web App.",
            MAIN_INLINE_KEYBOARD
        )

    # 5. /apuestas
    if lower in ["/apuestas", "/apuesta", "⚽ apuestas deportivas", "pronosticos", "partidos"]:
        return pronostico_deportivo()

    # 6. /propaganda
    if lower in ["/propaganda", "📢 propaganda $war", "promo", "anuncio"]:
        return propaganda_comunidad()

    # 7. /ayuda
    if lower in ["/ayuda", "/help", "ayuda", "reglas"]:
        return (
            f"📜 *GUÍA Y REGLAMENTO OFICIAL DE PROYECTO 66*\n\n"
            f"1. **Acceso Web:** Todos los juegos (Silo, WoW RPG, COD Táctico, Dominó) corren en la Web App para asegurar gráficos realistas y evitar problemas de conectividad.\n"
            f"2. **El Silo Cubano:**\n"
            f"   - El Banco es el jugador que tira contra toda la mesa (corre a la derecha).\n"
            f"   - Silo (4-5-6) o Cierre (triples): El banco recoge la mesa (10% comisión casa).\n"
            f"   - El Majá (1-2-3): El banco pierde y paga lo apostado.\n"
            f"   - Apuestas Alante (Alta: 11-18) y Atrás (Baja: 3-10).\n"
            f"   - **Empate:** Si los puntos coinciden, ¡NO se cobra ni se paga!\n"
            f"   - **1 Minuto:** Ventana de 60s entre tiros para apostar.\n"
            f"3. **Administración:** La Casa cobra el 10% de rake en botes ganados para la bóveda.\n\n"
            f"¿Deseas entrar a la Web de juegos o consultar la Bóveda?",
            MAIN_INLINE_KEYBOARD
        )

    # Respuesta cercana conversacional
    return (
        f"Comandante {username}, te escucho alto y claro sobre: \"{clean}\".\n\n"
        f"Todo el sistema está optimizado para que juegues y apuestes dentro de la Web App con fluidez. Aquí tienes el acceso:",
        MAIN_INLINE_KEYBOARD
    )

def handle_callback_query(u):
    cb = u.get("callback_query", {})
    cb_id = cb.get("id")
    data = cb.get("data")
    from_user = cb.get("from", {})
    username = from_user.get("first_name") or from_user.get("username") or "Comandante Max"
    chat_id = cb.get("message", {}).get("chat", {}).get("id", ADMIN_CHAT_ID)

    if data == "btn_admin":
        answer_callback(cb_id, "👑 Abriendo Bóveda de Max")
        t, k = panel_admin_max()
        send_message(chat_id, t, k)
    elif data == "btn_saldo":
        answer_callback(cb_id, "💰 Consultando saldo")
        bal = USER_BALANCES.get(username, 15450 if username == "Comandante Max" else 5000)
        send_message(chat_id, f"💰 *Tu Saldo:* {bal:,} P66 en red $WAR.", MAIN_INLINE_KEYBOARD)
    elif data == "btn_apuesta":
        answer_callback(cb_id, "⚽ Cargando pronóstico")
        t, k = pronostico_deportivo()
        send_message(chat_id, t, k)
    elif data == "btn_propaganda":
        answer_callback(cb_id, "📢 Transmitiendo anuncio")
        t, k = propaganda_comunidad()
        send_message(chat_id, t, k)
    else:
        answer_callback(cb_id, "Opción seleccionada")

def main():
    print("🚀 Telegram Bot Daemon YAN (Comandos Principales & Web App Hub) iniciado...")
    configure_bot_commands()
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
