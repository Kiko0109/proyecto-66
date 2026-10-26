# ====================================================================
# PROYECTO 66 - BOT DE TELEGRAM CONVERSACIONAL FLUIDO (SIN COMANDOS)
# Archivo: telegram_bot.py
# ====================================================================
# Habla con el usuario de manera 100% natural, como en un chat humano.
# Cada uno de los 7 bots responde con su propia voz y personalidad.
# ====================================================================

import os
import logging
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)
from yan import responder_fluido

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def conversar_natural(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Recibe cualquier texto en lenguaje natural y responde fluidamente con la IA
    sin necesidad de que el usuario use comandos con barra.
    """
    if update.message and update.message.text:
        texto_usuario = update.message.text.strip()
        # Generar respuesta con la IA integrada y personalidad correspondiente
        respuesta = responder_fluido(texto_usuario)
        await update.message.reply_text(respuesta, parse_mode="Markdown")

async def comando_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Si el usuario inicia el bot por primera vez"""
    saludo = (
        "⚡ **¡Hola, Comandante Kiko! Soy Yan, núcleo central de Proyecto 66.**

"
        "Tanto en tu APK como aquí en Telegram, todo nuestro sistema funciona con **conversación fluida y natural**: "
        "no necesitas usar comandos ni barras raras. Simplemente háblanos como a cualquier persona.

"
        "Estamos aquí tus 7 bots listos:
"
        "• **Yan**: Coordinación general
"
        "• **Kiko**: Programación, APKs y servidores
"
        "• **Max**: Estrategia táctica y trading
"
        "• **Buky**: Arte visual, vídeos y fotos
"
        "• **Gregoria**: Seguridad, ciencia y prudencia
"
        "• **Yanet**: Comunicación, redacción e idiomas
"
        "• **Kuko**: Dinámicas de juegos y entretenimiento

"
        "¿De qué te gustaría hablar hoy?"
    )
    await update.message.reply_text(saludo, parse_mode="Markdown")

def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("BOT_TOKEN")
    if not token:
        print("⚠️ TELEGRAM_BOT_TOKEN no configurado en entorno. En espera de credencial.")
        return
    app = Application.builder().token(token).build()
    
    # Manejador universal de conversación fluida (sin comandos)
    app.add_handler(CommandHandler("start", comando_start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, conversar_natural))
    # Por si alguien envía un comando con barra, lo canalizamos naturalmente
    app.add_handler(MessageHandler(filters.COMMAND, conversar_natural))
    
    logger.info("Yan y los 7 bots activos en Telegram en modo conversación fluida.")
    app.run_polling()

if __name__ == "__main__":
    main()
