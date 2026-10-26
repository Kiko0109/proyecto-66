# ====================================================================
# PROYECTO 66 - SINCRONIZADOR Y MUDANZA DE ESTADO ENTRE NUBES
# Archivo: auto_sync_state.py
# ====================================================================
# Mueve los datos a GitHub antes de que Render se apague o duerma,
# y los regresa exactamente a su sitio cuando el servidor despierta.
# ====================================================================

import os
import json
import time
import requests
import base64

STATE_FILE = "cloud_state.json"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_REPO = os.getenv("GITHUB_REPO", "Kiko0109/proyecto-66")

def move_state_to_github(state_data):
    """Guarda el estado en GitHub antes de reposo"""
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{STATE_FILE}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    sha = None
    try:
        r = requests.get(url, headers=headers, timeout=5)
        if r.status_code == 200:
            sha = r.json().get("sha")
    except:
        pass

    content_bytes = json.dumps(state_data, indent=2).encode("utf-8")
    payload = {
        "message": "Mudanza de estado segura a GitHub antes de reposo",
        "content": base64.b64encode(content_bytes).decode("utf-8"),
        "branch": "main"
    }
    if sha:
        payload["sha"] = sha
        
    r = requests.put(url, headers=headers, json=payload, timeout=10)
    return r.status_code in (200, 201)

def restore_state_from_github():
    """Descarga el estado de GitHub cuando el servidor despierta"""
    url = f"https://raw.githubusercontent/{GITHUB_REPO}/main/{STATE_FILE}"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            with open(STATE_FILE, "w", encoding="utf-8") as f:
                f.write(r.text)
            print("✅ Estado restaurado con éxito desde GitHub.")
            return r.json()
    except Exception as e:
        print(f"Error al restaurar: {e}")
    return None

if __name__ == "__main__":
    print("🔄 Sincronizador de Mudanzas de Nube Activo.")
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        move_state_to_github(data)
    else:
        restore_state_from_github()
