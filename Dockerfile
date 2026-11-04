# Dockerfile para Hugging Face Spaces - Proyecto 66 MUNDOX Games Hub
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# Imagen de producción ligera
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=7860

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/public ./public

# Configurar usuario estándar de Hugging Face (UID 1000)
RUN useradd -m -u 1000 user
USER user

EXPOSE 7860

CMD ["node", "server.js"]
