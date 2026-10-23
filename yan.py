
"""
Proyecto 66 - Yan
Coordinador inicial de los siete bots.
No contiene tokens ni contraseñas.
"""

BOTONES_PROYECTO = {
    "Yan": "Coordina el proyecto y reparte tareas",
    "Kiko": "Programación, juegos y APKs",
    "Max": "Gráficos e imágenes",
    "Buky": "Vídeo y multimedia",
    "Gregoria": "Seguridad y auditoría",
    "Yanet": "Memoria y almacenamiento",
    "Kuko": "Servidores y despliegue",
}


def mostrar_equipo():
    """Devuelve la lista de los siete bots."""
    return "\n".join(
        f"- {nombre}: {funcion}"
        for nombre, funcion in BOTONES_PROYECTO.items()
    )


def responder(orden):
    """Procesa órdenes básicas de Yan."""
    orden = orden.strip().lower()

    if orden in ("/start", "hola", "/hola"):
        return (
            "¡Hola! Soy Yan, coordinador de Proyecto 66.\n"
            "Estoy preparado para comenzar.\n\n"
            "Usa /equipo para ver los siete bots.\n"
            "Usa /estado para consultar mi estado."
        )

    if orden in ("/equipo", "equipo"):
        return "Equipo de Proyecto 66:\n" + mostrar_equipo()

    if orden in ("/estado", "estado"):
        return (
            "Proyecto 66: base inicial creada.\n"
            "Modo: pruebas.\n"
            "Telegram: todavía no conectado.\n"
            "IA: todavía no conectada."
        )

    if orden in ("/ayuda", "ayuda", "/help"):
        return (
            "Órdenes disponibles:\n"
            "/start - Iniciar\n"
            "/equipo - Ver el equipo\n"
            "/estado - Consultar el estado\n"
            "/ayuda - Mostrar esta ayuda"
        )

    return (
        "Soy Yan, coordinador de Proyecto 66.\n"
        "Todavía estoy en mi versión inicial. "
        "Escribe /ayuda para ver mis órdenes."
    )


if __name__ == "__main__":
    print("Yan - Proyecto 66")
    print("Escribe una orden; escribe salir para terminar.")

    while True:
        orden = input("Tú: ").strip()

        if orden.lower() == "salir":
            print("Yan: Hasta pronto.")
            break

        print("Yan:", responder(orden))
