import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 7860; // 7860 es el puerto nativo de Hugging Face Spaces

// Servir archivos estáticos construidos por Vite
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Endpoint de diagnóstico y salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Proyecto 66 - MUNDOX Telegram Games Hub',
    server: 'Hugging Face Spaces / Node Production',
    uptime: process.uptime(),
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Fallback SPA: todas las rutas cargan index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Servidor MUNDOX activo en http://0.0.0.0:${PORT}`);
});
