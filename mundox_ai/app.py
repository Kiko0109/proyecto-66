#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MUNDOX AI — SERVIDOR PRINCIPAL EN HUGGING FACE SPACES
Propietario: Comandante Max / Kiko0109 (https://huggingface.co/max0109)
"""

import os
import sys
import json
import sqlite3
from http.server import HTTPServer, BaseHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "mundox_memory.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS facts (
            key TEXT PRIMARY KEY,
            val TEXT,
            category TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    default_facts = [
        ("owner", "Comandante Max / Kiko0109", "identidad"),
        ("server", "Hugging Face Space Soberano", "infraestructura"),
        ("game_primary", "DEAD LAN (Godot 4.3 Android - 50.000 km²)", "gamedev"),
        ("ai_models", "Meta Llama 3.2 3B / Qwen 2.5 3B", "modelos"),
        ("trading_status", "ELIMINADO_POR_COMPLETO", "seguridad")
    ]
    for k, v, cat in default_facts:
        c.execute("INSERT OR IGNORE INTO facts (key, val, category) VALUES (?, ?, ?)", (k, v, cat))
    conn.commit()
    conn.close()

init_db()

AGENTS = {
    "Yan": "Núcleo Orquestador, memoria persistente y coordinación general",
    "Kiko": "Ingeniero de Software y Godot 4.3 Mobile GDScript / C#",
    "Buky": "Director Visual, Modelado 3D, Shaders PBR y Texturas",
    "Vektor": "Dirección Cinemática, Storyboards y Escenas de Acción",
    "Yanet": "Diseño Sonoro, Síntesis Piper TTS y Radio Militar",
    "Tarkov": "Balística, Combate Táctico, Vehículos y Facciones de DEAD LAN",
    "Gregoria": "Auditoría de Seguridad, Revisión de Código y Mitigación de Riesgos"
}

class MundoxHfHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("SELECT key, val, category FROM facts")
        facts = [{"key": r[0], "val": r[1], "category": r[2]} for r in c.fetchall()]
        conn.close()

        self._send_json({
            "status": "online",
            "server": "MUNDOX AI — Servidor Hugging Face Space",
            "owner": "Comandante Max (Kiko0109)",
            "hf_account": "max0109",
            "active_agents": AGENTS,
            "memory_facts": facts,
            "connected_game": "DEAD LAN (50.000 km² Supervivencia Táctica)",
            "battery_phone_cost": "0% (Todo corre en Hugging Face)"
        })

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")
        data = json.loads(body) if body else {}

        agent = data.get("agent", "Yan")
        prompt = data.get("prompt", "Estado de la colmena")

        reply = (
            f"🧠 [{agent} @ Hugging Face Space]: Saludos, Comandante Max.\n\n"
            f"• Solicitud recibida: \"{prompt}\"\n"
            f"• Conexión: Espacio soberano en Hugging Face (sin dependencias comerciales).\n"
            f"• Videojuego DEAD LAN: Servidor LAN P2P y vehículos (Hilux .50 y Lancha MK-V) sincronizados.\n"
            f"• Estado del Trading: Eliminado por completo según tu orden soberana.\n"
            f"¿Deseas compilar la escena en Godot o ajustar parámetros tácticos?"
        )

        self._send_json({
            "agent": agent,
            "reply": reply,
            "server_host": "Hugging Face Space",
            "status": "success"
        })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"🚀 MUNDOX AI Server iniciado en Hugging Face Spaces (puerto {port})...")
    server = HTTPServer(("0.0.0.0", port), MundoxHfHandler)
    server.serve_forever()
