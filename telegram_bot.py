import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters,
)
from yan import responder_comando

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

JUEGOS_TXT = {
    "1": {
        "titulo": "Matriz Cuántica 66",
        "descripcion": "Juego de memoria cuántica táctica. Memoriza secuencias energéticas.",
    },
    "2": {
        "titulo": "Cripto Terminal Logic",
        "descripcion": "Descifra el código secreto de 4 dígitos mediante deducción lógica.",
    },
    "3": {
        "titulo": "Reflejos Neón 66",
        "descripcion": "Entrenamiento de reflejos neuronales para operaciones tácticas.",
    }
}

async def iniciar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(responder_comando("/start"))

async def equipo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(responder_comando("/equipo"))

async def estado(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(responder_comando("/estado"))

async def ayuda(update: Update, context: ContextTypes.DEFAULT_TYPE):
    ayuda_texto = (
        "🤖 *ÓRDENES DISPONIBLES EN PROYECTO 66:*

"
        "• /start - Iniciar comunicación
"
        "• /equipo - Ver los 7 bots y sus roles
"
        "• /estado - Consultar salud de la red de nubes y Cuba OK
"
        "• /juegos o /jugar - Abrir biblioteca de juegos ligeros
"
        "• /almacenamiento - Ver cómo se guardan las cosas en .txt y Telegram
"
        "• /ayuda - Mostrar este menú"
    )
    await update.message.reply_text(ayuda_texto, parse_mode="Markdown")

async def juegos(update: Update, context: ContextTypes.DEFAULT_TYPE):
    texto = (
        "🎮 *BIBLIOTECA DE JUEGOS EN LA NUBE (Kuko & Kiko):*
"
        "Estos juegos se guardan en la nube en formato  ultra-ligero (<10 KB).
"
        "Se ejecutan tanto aquí en Telegram como en tu APK de Android.

"
        "1. *Matriz Cuántica 66*
"
        "2. *Cripto Terminal Logic*
"
        "3. *Reflejos Neón 66*

"
        "Toca un botón para jugar directo en Telegram:"
    )
    keyboard = [
        [
            InlineKeyboardButton("▶️ Matriz Cuántica", callback_data="play_1"),
            InlineKeyboardButton("▶️ Cripto Terminal", callback_data="play_2")
        ],
        [
            InlineKeyboardButton("▶️ Reflejos Neón", callback_data="play_3")
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(texto, parse_mode="Markdown", reply_markup=reply_markup)

async def almacenamiento(update: Update, context: ContextTypes.DEFAULT_TYPE):
    texto = (
        "☁️ *ALMACENAMIENTO ILIMITADO EN TELEGRAM & .TXT:*

"
        "• *Formato .TXT Ligero:* Guardamos configuraciones, predicciones y lógicas de juegos en archivos de texto de menos de 15 KB.
"
        "• *Nube Telegram Ilimitada:* Fotos, gráficos de Buky y vídeos se almacenan en Telegram (hasta 2 GB gratis por archivo).
"
        "• *Cero consumo en móvil:* Tu teléfono no guarda archivos pesados; solo lee bajo demanda."
    )
    await update.message.reply_text(texto, parse_mode="Markdown")

async def recibir_mensaje(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message and update.message.text:
        texto = update.message.text.strip()
        if texto.lower().startswith(("/jugar", "jugar")):
            await juegos(update, context)
            return
        respuesta = responder_comando(texto)
        await update.message.reply_text(respuesta)

async def boton_pulsado(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    game_id = query.data.replace("play_", "")
    info = JUEGOS_TXT.get(game_id, {"titulo": "Juego Táctico", "descripcion": "Iniciando..."})
    await query.edit_message_text(
        f"🎮 *{info['titulo']} (Activo en Telegram)*

"
        f"{info['descripcion']}

"
        f"💡 *Este mismo juego se ejecuta en tu APK de Android leyendo el mismo archivo .txt en la nube.*"
    )

def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("BOT_TOKEN")
    if not token:
        print("⚠️ TELEGRAM_BOT_TOKEN no configurado en entorno. En espera de configuración.")
        return
    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", iniciar))
    app.add_handler(CommandHandler("equipo", equipo))
    app.add_handler(CommandHandler("estado", estado))
    app.add_handler(CommandHandler("ayuda", ayuda))
    app.add_handler(CommandHandler("juegos", juegos))
    app.add_handler(CommandHandler("jugar", juegos))
    app.add_handler(CommandHandler("almacenamiento", almacenamiento))
    app.add_handler(CallbackQueryHandler(boton_pulsado))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, recibir_mensaje))
    logger.info("Yan está iniciando en Telegram.")
    app.run_polling()

if __name__ == "__main__":
    main()
