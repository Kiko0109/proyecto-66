
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

from yan import responder

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def iniciar(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    await update.message.reply_text(responder("/start"))


async def equipo(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    await update.message.reply_text(responder("/equipo"))


async def estado(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    await update.message.reply_text(responder("/estado"))


async def ayuda(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    await update.message.reply_text(responder("/ayuda"))


async def recibir_mensaje(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    if update.message and update.message.text:
        respuesta = responder(update.message.text)
        await update.message.reply_text(respuesta)


def main():
    token = os.getenv("BOT_TOKEN")

    if not token:
        raise RuntimeError(
            "Falta configurar el secreto BOT_TOKEN."
        )

    app = Application.builder().token(token).build()

    app.add_handler(CommandHandler("start", iniciar))
    app.add_handler(CommandHandler("equipo", equipo))
    app.add_handler(CommandHandler("estado", estado))
    app.add_handler(CommandHandler("ayuda", ayuda))

    app.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            recibir_mensaje
        )
    )

    logger.info("Yan está iniciando en Telegram.")
    app.run_polling()


if __name__ == "__main__":
    main()
