# ====================================================================
# PROYECTO 66 - YAN (NÚCLEO ESTRATÉGICO Y COORDINADOR DE LOS 7 BOTS)
# Archivo: yan.py
# ====================================================================

import os
import json
import time

BOTS_EQUIPO = {
    "Yan": {
        "codigo": "CORE-01",
        "rol": "Coordinador central, visión global y asignación estratégica",
        "color": "#00f0ff"
    },
    "Kiko": {
        "codigo": "DEV-02",
        "rol": "Programación, desarrollo de APKs, ciberseguridad y GitHub",
        "color": "#3b82f6"
    },
    "Max": {
        "codigo": "TAC-03",
        "rol": "Estrategia táctica, trading intradía (<4h), Stop Loss y lotes (0.001 - 1.00)",
        "color": "#10b981"
    },
    "Buky": {
        "codigo": "ART-04",
        "rol": "Creatividad cyberpunk, arte visual, vídeos, gráficos y fotos",
        "color": "#f59e0b"
    },
    "Gregoria": {
        "codigo": "SAGE-05",
        "rol": "Auditoría de riesgos, filosofía estoica, ciencia y rigor",
        "color": "#8b5cf6"
    },
    "Yanet": {
        "codigo": "VOX-06",
        "rol": "Comunicación asertiva, negociación, idiomas, audios y memoria",
        "color": "#ec4899"
    },
    "Kuko": {
        "codigo": "FUN-07",
        "rol": "Gamificación, acertijos, creación de dinámicas y entretenimiento",
        "color": "#eab308"
    }
}

def obtener_equipo_completo():
    lineas = ["👥 **MESA REDONDA: LOS 7 BOTS DE PROYECTO 66 Y TÚ:**"]
    for nombre, info in BOTS_EQUIPO.items():
        lineas.append(f"• **{nombre} ({info['codigo']})**: {info['rol']}")
    return "\n".join(lineas)

def responder_comando(comando):
    cmd = comando.strip().lower()
    if cmd in ("/start", "hola", "saludos"):
        return (
            "⚡ ¡Saludos, Comandante Kiko! Soy Yan, núcleo central de Proyecto 66.\n\n"
            "Todo el sistema en la nube está enlazado a tu control.\n"
            "Escribe /equipo para ver a los 7 bots o /estado para el reporte de los servidores."
        )
    if cmd in ("/equipo", "equipo", "bots"):
        return obtener_equipo_completo()
    if cmd in ("/estado", "estado", "nube"):
        return (
            "☁️ **ESTADO DE LA RED DE NUBES:**\n"
            "• Servidores: Render + GitHub Actions (24/7 enlazados)\n"
            "• Conexión: Datacenters en EE.UU./Europa (0% bloqueo de Cuba)\n"
            "• Modo Soberano: Solo operamos bajo tu orden directa\n"
            "• Batería móvil: 0% consumo (todo corre en la nube)"
        )
    if "parar" in cmd or "detener" in cmd:
        return "🛑 **ORDEN RECIBIDA**: Los 7 bots se detienen y entran en modo reposo."
    if "empezar" in cmd or "operar" in cmd or "estudiar" in cmd:
        return "🚀 **ORDEN RECIBIDA**: Motor táctico activado bajo tu mandato."
    
    return f"🔹 Yan (CORE-01): Mensaje recibido: '{comando}'. ¿Deseas que intervenga Kiko, Max o Gregoria?"

if __name__ == "__main__":
    print("⚡ Proyecto 66 - Núcleo Yan iniciado.")
    print(obtener_equipo_completo())
