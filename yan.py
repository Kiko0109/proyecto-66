# ====================================================================
# PROYECTO 66 - YAN & CONSEJO DE LOS 7 BOTS (MOTOR CONVERSACIONAL FLUIDO)
# Archivo: yan.py
# ====================================================================
# Cada bot tiene su propia personalidad e inteligencia integrada.
# CERO COMANDOS RÍGIDOS: Conversación 100% natural y fluida.
# ====================================================================

import os
import json
import time

BOTS_INFO = {
    "yan": {
        "nombre": "Yan",
        "codigo": "CORE-01",
        "titulo": "Núcleo Central y Coordinador Estratégico",
        "color": "#00f0ff",
        "estilo": "Visionario, analítico, sereno, habla como un líder de confianza y estratega."
    },
    "kiko": {
        "nombre": "Kiko",
        "codigo": "DEV-02",
        "titulo": "Desarrollador, APKs y Ciberseguridad",
        "color": "#3b82f6",
        "estilo": "Pragmático, técnico, enfocado en código limpio, servidores Render/GitHub y APKs."
    },
    "max": {
        "nombre": "Max",
        "codigo": "TAC-03",
        "titulo": "Comandante Táctico y Trading",
        "color": "#10b981",
        "estilo": "Militar, disciplinado, directo, cero rodeos, enfocado en metas y gestión de riesgo."
    },
    "buky": {
        "nombre": "Buky",
        "codigo": "ART-04",
        "titulo": "Creatividad, Arte Visual y Multimedia",
        "color": "#f59e0b",
        "estilo": "Apasionado, artístico, estética cyberpunk neón, describe atmósferas y conceptos visuales."
    },
    "gregoria": {
        "nombre": "Gregoria",
        "codigo": "SAGE-05",
        "titulo": "Sabiduría, Filosofía y Auditoría de Riesgos",
        "color": "#8b5cf6",
        "estilo": "Estoica, científica, reflexiva, cautelosa, cita principios de serenidad y prudencia."
    },
    "yanet": {
        "nombre": "Yanet",
        "codigo": "VOX-06",
        "titulo": "Comunicación, Idiomas y Negociación",
        "color": "#ec4899",
        "estilo": "Elocuente, empática, diplomática, experta en palabras, acuerdos y traducción."
    },
    "kuko": {
        "nombre": "Kuko",
        "codigo": "FUN-07",
        "titulo": "Gamificación, Acertijos y Entretenimiento",
        "color": "#eab308",
        "estilo": "Dinámico, divertido, ingenioso, propone acertijos y juegos de lógica en el acto."
    }
}

def responder_como_kiko(texto):
    t = texto.lower()
    if "render" in t or "servidor" in t or "nube" in t:
        return "💻 **Kiko (DEV-02)**: Los servidores en Render y GitHub están corriendo en la nube de Estados Unidos y Europa. Tu móvil está al 0% de uso de batería. Si un servidor se duerme, auto_sync_state.py ya dejó todo respaldado en GitHub."
    if "apk" in t or "android" in t:
        return "💻 **Kiko (DEV-02)**: Con Capacitor o el WebView de la nube, la APK no pesa casi nada. El juego o la lógica se ejecutan directamente en la red de nubes y se muestran en la pantalla de tu móvil sin saturar el almacenamiento."
    return f"💻 **Kiko (DEV-02)**: Sobre eso que me comentas: técnicamente lo mejor es mantener todo en archivos .txt ligeros y sin dependencias infladas. ¿Quieres que prepare un script o revisemos alguna función?"

def responder_como_max(texto):
    t = texto.lower()
    if "trading" in t or "oro" in t or "mercado" in t or "operar" in t:
        return "🎯 **Max (TAC-03)**: ¡Firmes! En el trading la regla de oro es la disciplina militar: horizonte máximo de 4 horas, Stop Loss inmutable y riesgo del 2%. Nada de operar por impulso. Y recuerda: solo entramos si tú das la orden expresa."
    return f"🎯 **Max (TAC-03)**: Cero divagaciones. Plantea el objetivo en una sola frase, definimos las 3 acciones inmediatas y lo ejecutamos. ¿Cuál es el blanco de ataque hoy?"

def responder_como_buky(texto):
    t = texto.lower()
    if "video" in t or "foto" in t or "imagen" in t or "diseño" in t or "arte" in t:
        return "🎨 **Buky (ART-04)**: ¡Visualízalo! Fondo negro obsidiana, contrastes en azul cian eléctrico #00f0ff y tipografía geométrica nítida. Si creamos imágenes o vídeos pesados, los subimos a Telegram para que no te ocupen espacio en el móvil, y aquí enlazamos el texto ligero."
    return f"🎨 **Buky (ART-04)**: ¡Me gusta esa vibra! En diseño, menos es más: cada línea debe tener energía cyberpunk. ¿Quieres que le demos forma visual a esa idea?"

def responder_como_gregoria(texto):
    t = texto.lower()
    if "riesgo" in t or "seguridad" in t or "consejo" in t:
        return "🧭 **Gregoria (SAGE-05)**: Un saludo sereno. Como enseñaba Séneca: no podemos controlar el viento, pero sí ajustar las velas. En tus proyectos, asegúrate de tener siempre un respaldo verificado y no depender de un solo servidor."
    return f"🧭 **Gregoria (SAGE-05)**: Cuando examinamos las cosas con calma y pensamiento crítico, los problemas se dividen en partes sencillas. Cuenta con mi criterio para auditar cualquier decisión."

def responder_como_yanet(texto):
    t = texto.lower()
    if "mensaje" in t or "idioma" in t or "hablar" in t or "negocio" in t or "redactar" in t:
        return "💬 **Yanet (VOX-06)**: ¡Hola! La clave para transmitir esa idea con impacto es la asertividad: claridad en los primeros 5 segundos, hechos verificables y una llamada a la acción elegante. ¿Quieres que redactemos una propuesta juntos?"
    return f"💬 **Yanet (VOX-06)**: Qué interesante enfoque. La comunicación fluida une a las personas y abre puertas con inversores. ¿Cómo prefieres que enfoquemos el mensaje?"

def responder_como_kuko(texto):
    t = texto.lower()
    if "juego" in t or "jugar" in t or "acertijo" in t or "aburrid" in t:
        return "🎮 **Kuko (FUN-07)**: ¡Epaaa, llegó la diversión! Aquí tienes un acertijo rápido de lógica para calentar motores:

*"Soy más ligero que una pluma, pero ni el hombre más fuerte del mundo puede sostenerme por más de 5 minutos. ¿Qué soy?"*

(¿Lo sabes o te rindes? 😉 Además, recuerda que en la APK y en Telegram puedes abrir la Matriz Cuántica o el Cripto Terminal cuando quieras)."
    return f"🎮 **Kuko (FUN-07)**: ¡Wazaaa! Cuenta conmigo para ponerle chispa al día. Si los demás bots se ponen demasiado serios, aquí estoy para soltar un reto o una trivia tecnológica. ¡A darle con ganas!"

def responder_como_yan(texto):
    t = texto.lower()
    if "hola" in t or "buenos" in t or "que tal" in t or "saludos" in t:
        return "⚡ **Yan (CORE-01)**: ¡Hola, Comandante Kiko! Qué gusto conversar contigo. Aquí estamos tus 7 inteligencias tácticas conectadas a la red de nubes. Todo funciona en lenguaje natural: solo háblame como lo haces siempre, sin comandos raros. ¿En qué nos enfocamos hoy?"
    if "como estan" in t or "como están" in t or "equipo" in t:
        return "🔹 **Yan (CORE-01)**: Todo el equipo está activo en línea:
• Kiko cuidando los servidores y APKs.
• Max listo con la estrategia táctica.
• Buky en la parte visual y gráfica.
• Gregoria velando por la seguridad.
• Yanet atenta a la comunicación.
• Y Kuko listo para cualquier dinámica de juegos.

Puedes hablarle directamente a cualquiera de nosotros por su nombre."
    if "parar" in t or "detener" in t or "pausa" in t:
        return "🛑 **Yan (CORE-01)**: Orden comprendida al instante. Los 7 bots entran en modo reposo y se detiene cualquier escaneo en el mercado hasta nuevo aviso tuyo."
    if "empezar" in t or "operar" in t or "estudiar" in t:
        return "🚀 **Yan (CORE-01)**: ¡Entendido! Reanudamos el estudio táctico de mercado en la nube bajo tu dirección."
    
    return f"🔹 **Yan (CORE-01)**: Te escucho atentamente, Kiko. Respecto a lo que mencionas: podemos canalizarlo de inmediato. Si involucra programación llamo a Kiko; si es de mercado interviene Max; si es visual entra Buky, o si quieres jugar le doy paso a Kuko. ¿Cómo lo ves?"

def responder_fluido(texto):
    """
    Detecta automáticamente a quién se dirige el usuario o el tema,
    respondiendo de forma humana y fluida SIN NECESIDAD DE COMANDOS.
    """
    t = texto.lower().strip()
    
    # Detección por nombre explícito del bot
    if t.startswith("kiko") or " kiko" in t:
        return responder_como_kiko(texto)
    if t.startswith("max") or " max" in t:
        return responder_como_max(texto)
    if t.startswith("buky") or " buky" in t or "buki" in t:
        return responder_como_buky(texto)
    if t.startswith("gregoria") or " gregoria" in t:
        return responder_como_gregoria(texto)
    if t.startswith("yanet") or " yanet" in t or "janet" in t:
        return responder_como_yanet(texto)
    if t.startswith("kuko") or " kuko" in t or "cuco" in t:
        return responder_como_kuko(texto)
    
    # Detección contextual por tema
    if any(w in t for w in ["juego", "jugar", "acertijo", "trivia", "adivinanza"]):
        return responder_como_kuko(texto)
    if any(w in t for w in ["trading", "oro", "acciones", "lote", "stop loss", "take profit"]):
        return responder_como_max(texto)
    if any(w in t for w in ["codigo", "código", "servidor", "render", "apk", "github", "error"]):
        return responder_como_kiko(texto)
    if any(w in t for w in ["dibujo", "imagen", "diseño", "foto", "video", "gráfico", "cyberpunk"]):
        return responder_como_buky(texto)
    if any(w in t for w in ["consejo", "riesgo", "seguridad", "filosofia", "prudencia"]):
        return responder_como_gregoria(texto)
    if any(w in t for w in ["idioma", "ingles", "redactar", "mensaje", "negociar", "audio"]):
        return responder_como_yanet(texto)

    # Respuesta general coordinada por Yan
    return responder_como_yan(texto)

# Aliases de compatibilidad
responder = responder_fluido
responder_comando = responder_fluido

if __name__ == "__main__":
    print("⚡ Proyecto 66 - Motor de Conversación Fluida Activo.")
