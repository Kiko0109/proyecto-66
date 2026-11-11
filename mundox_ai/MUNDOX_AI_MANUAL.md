# 🧠 MANUAL MAESTRO DE INSTALACIÓN Y OPERACIÓN — MUNDOX AI

Asistente Táctico Autónomo de Inteligencia Artificial para Android 11 y Servidor en la Nube.
Diseñado para **Kiko0109 / Comandante Max**.

---

## 1. FILOSOFÍA Y SOBERANÍA TOTAL

- **Cero dependencias obligatorias:** No depende de OpenAI (ChatGPT), Anthropic (Claude) ni Google (Gemini).
- **Código Abierto Primero:** Opera con modelos abiertos (Qwen 2.5, Meta Llama 3.2, Stable Diffusion, Piper TTS) alojados en tu propio servidor.
- **Memoria Persistente SQLite:** La IA recuerda tus proyectos (DEAD LAN, Proyecto 66), decisiones, gustos y órdenes en una base de datos local que nunca se borra al reiniciar.
- **Ahorro estricto de recursos:** Adaptado para VPS de 16 GB de RAM y menos de 50 GB de almacenamiento, sin colapsar el disco.

---

## 2. INSTALACIÓN EN 3 PASOS EN TU SERVIDOR

### Paso 1: Clonar y analizar el hardware automáticamente
Conéctate por SSH a tu servidor en la nube y ejecuta:
```bash
git clone https://github.com/Kiko0109/proyecto-66.git
cd proyecto-66/mundox_ai
python3 hardware_check.py
```
El script detectará en 2 segundos:
- Tu Sistema Operativo (Ubuntu, Debian, CentOS, etc.).
- Si hay GPU NVIDIA o AMD y cuántos GB de VRAM tiene.
- Cuánta RAM libre tienes de los 16 GB.
- Cuánto espacio queda de los 50 GB.
- Creará el archivo `hardware_report.json` con la recomendación exacta de modelos.

### Paso 2: Despliegue con Docker (1 solo comando)
```bash
docker compose up -d
```
Esto levantará:
- El motor de inferencia local Ollama en el puerto `11434`.
- El servidor multi-agente de MUNDOX AI en el puerto `8080`.

### Paso 3: Descargar el modelo adaptado a tu hardware
- Si tu servidor tiene GPU con 8GB+ VRAM:
  ```bash
  docker exec -it mundox-ollama-engine ollama run qwen2.5:7b
  ```
- Si tu servidor usa CPU multihilo con los 16GB de RAM:
  ```bash
  docker exec -it mundox-ollama-engine ollama run qwen2.5:3b
  ```
*(El modelo 3B solo pesa 2.0 GB en disco y responde al instante en español sin agotar los 50 GB).*

---

## 3. LOS 7 AGENTES ESPECIALIZADOS

1. **Yan (Núcleo Orquestador - CORE-01):** Coordinador central, memoria a largo plazo y planificación.
2. **Kiko (Ingeniería de Software - DEV-02):** GDScript para Godot 4, Python, APKs Android y Ciberseguridad.
3. **Buky (Director Visual & Arte 3D - ART-04):** Texturas, iluminación cinemática, shaders PBR y prompts 3D.
4. **Vektor (Director de Escenas & Vídeo - CINEMA):** Guiones, cinemáticas iniciales, encuadres y storyboards.
5. **Yanet (Voz, Audio & Idiomas - VOX-06):** Efectos sonoros realistas, radio táctica y síntesis Piper TTS.
6. **Tarkov (Videojuegos & Simulación - GAME):** Balística, mecánicas de armas, conducción de vehículos y facciones.
7. **Gregoria (Auditoría Técnica - SAGE-05):** Verificación de seguridad, pruebas de estrés y matemáticas.

---

## 4. PROTOCOLO DE AUTO-MEJORA EN 10 PASOS (CON AUTORIZACIÓN HUMANA)

Para evitar que la IA modifique código de forma imprevista:
1. **Detección:** El agente detecta lentitud, cuello de botella o excepción.
2. **Propuesta:** Formula la solución técnica en texto claro.
3. **Análisis Estático:** Verifica sintaxis y tipos sin tocar el archivo real.
4. **Prueba en Sandbox:** Se compila en un entorno temporal aislado.
5. **Generación de Diff:** Muestra exactamente qué líneas cambiarán en verde y rojo.
6. **Solicitud de Token:** Envía notificación a tu móvil Android con un código de autorización.
7. **Aprobación Humana:** Tú tocas "Aprobar y Aplicar" o "Rechazar".
8. **Aplicación:** Si y solo si aprobaste, se escribe el parche en disco.
9. **Validación Post-Parche:** Se comprueba que los servicios sigan en verde.
10. **Snapshot de Reversión:** Si ocurre cualquier anomalía, se revierte en 1 segundo con un clic.

---

## 5. MÓDULO FINANCIERO Y CRIPTOMONEDAS (AIR-GAPPED SANDBOX)

- **Aislamiento Total de Claves Privadas:** La clave privada NUNCA se pasa al modelo de IA ni a los prompts.
- **Red de Pruebas (Testnet):** Todas las pruebas se realizan con saldo virtual antes de la red principal.
- **Límite Diario Estricto:** Máximo 50 USDT o equivalente por día sin confirmación biométrica.
- **Kill-Switch Inmediato:** Botón rojo de emergencia que congela cualquier llamada API saliente.

---

## 6. MODO OFFLINE EN ANDROID 11

Cuando estés sin conexión a Internet o datos móviles:
- La app de Android cambia automáticamente al **Modo Offline Autónomo**.
- Utiliza la memoria caché local SQLite y el motor ligero integrado en el teléfono.
- Cuando recuperas señal Wi-Fi o datos, se sincroniza automáticamente con el servidor en la nube sin duplicar datos.
