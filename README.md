# ⚡ Proyecto 66 - Red de Nubes y Colmena de Servidores 24/7

Sistema distribuido para **Kiko0109** con los **7 Bots Tácticos** (Yan, Kiko, Max, Buky, Gregoria, Yanet, Kuko), diseñado para operar 24/7 en la nube **sin consumir batería ni datos en tu teléfono móvil Android**.

---

## 🛡️ Principios Maestros de la Red:
1. **Soberanía Absoluta del Comandante:** Ningún bot opera ni analiza en mercado sin tu orden expresa (`COMMANDER_STATUS = STANDBY`). Empiezan solo cuando tú dices *"Empiecen a estudiar y operar"*, y paran inmediatamente cuando dices *"Paren de estudiar"*.
2. **0% Batería y Sin Bloqueo de Cuba:** El código corre en servidores de **Render** (AWS Oregón/Frankfurt) y **GitHub Actions** (Azure Virginia). Las peticiones a APIs financieras y brokers salen desde EE.UU./Europa, evitando los bloqueos de IP en Cuba.
3. **Persistencia y Anti-Sleep Inteligente (Ahorro de los 750h/mes de Render):**
   - Cuando Render entra en reposo después de 15 min sin visitas, el script `auto_sync_state.py` guarda automáticamente el estado (`cloud_state.json`) en este repositorio de GitHub.
   - Cuando Render despierta, descarga el último estado y lo restaura sin perder ningún dato.
   - Si conectas 2 cuentas gratuitas de Render (la tuya y la de un amigo/socio), tienes **1,500 horas gratis al mes** (un mes tiene 720h), garantizando cobertura 24/7 ininterrumpida sin gastar un centavo.
4. **Auto-Corrección y Aprendizaje de Errores:**
   - Si una predicción de otra APK o fuente externa falla, el motor la analiza, detecta el error en los indicadores y aprende para regalarte la corrección optimizada.
   - En caso de fallo en el código, el sistema reescribe el estado y se auto-repara.

---

## 🤖 El Equipo de los 7 Bots:
* 🔹 **Yan (CORE-01):** Coordinador central, visión holística y asignación de misiones.
* 💻 **Kiko (DEV-02):** Programación, arquitectura limpia, APKs Android y ciberseguridad.
* 🎯 **Max (TAC-03):** Estrategia táctica, trading intradía (<4h), Stop Loss y lotes (0.001 - 1.00).
* 🎨 **Buky (ART-04):** Estética cyberpunk, arte visual, gráficos, fotos y vídeo.
* 🧭 **Gregoria (SAGE-05):** Auditoría estricta de riesgos, ciencia y filosofía estoica.
* 💬 **Yanet (VOX-06):** Comunicación asertiva, traducción, idiomas, audios y memoria RAG.
* 🎮 **Kuko (FUN-07):** Gamificación, dinámicas de juegos interactivos, acertijos y humor.

---

## 🚀 Despliegue en Render (1 Clic Gratis):
1. Inicia sesión en **[render.com](https://render.com/)** con tu cuenta de GitHub.
2. Crea un **New > Web Service**.
3. Selecciona este repositorio: `Kiko0109/proyecto-66`.
4. Render detectará automáticamente el archivo `Procfile` y `requirements.txt`.
5. ¡Listo! Tu nodo web en la nube queda activo 24/7 con dirección propia `.onrender.com`.
