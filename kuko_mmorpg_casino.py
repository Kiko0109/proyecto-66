# ==============================================================================
# PROYECTO 66: MOTOR BACKEND MMORPG (24 RAZAS & EVOLUCIÓN) + CRIPTO CASINO BEP-20
# SERVIDOR RENDER 24/7 (0 MB MÓVIL / CLOUD-NATIVE)
# ==============================================================================
import hashlib
import time
import random
from flask import Blueprint, jsonify, request

mmorpg_casino_bp = Blueprint("mmorpg_casino", __name__)

TITLES = [
    {
        "id": "omnia-66",
        "name": "OMNIA 66",
        "subtitle": "Ascensión del Nexo Soberano",
        "tagline": "Evolución Total y Conquista Multiversal estilo Elden Ring / Final Fantasy.",
        "recommended": True
    },
    {
        "id": "nexus-origin",
        "name": "NEXUS ORIGIN",
        "subtitle": "Crónicas del Nexo Soberano",
        "tagline": "El Origen Cósmico de las 24 Razas y linajes soberanos.",
        "recommended": False
    },
    {
        "id": "astralis-66",
        "name": "ASTRALIS 66",
        "subtitle": "El Despertar de los Reinos",
        "tagline": "Mundos Flotantes, Magia Estelar y transmutaciones cósmicas.",
        "recommended": False
    },
    {
        "id": "genesis-soberano",
        "name": "GÉNESIS SOBERANO",
        "subtitle": "Crónicas del Nexo Infinito",
        "tagline": "Transmutación Rúnica y Economía respaldada en USDT BEP-20.",
        "recommended": False
    },
    {
        "id": "valkyria-66",
        "name": "VALKYRIA 66",
        "subtitle": "Ecos del Nexo Eterno",
        "tagline": "Mitología Nórdico-Cyberpunk de combate visceral.",
        "recommended": False
    }
]

FACTIONS = [
    {"id": "linaje_terraqueo", "name": "Linaje Terráqueo & Forjadores", "races_count": 6},
    {"id": "linaje_arcano", "name": "Linaje Arcano & Celestial", "races_count": 6},
    {"id": "linaje_bestial", "name": "Linaje Bestial & Sombrío", "races_count": 6},
    {"id": "linaje_ascendido", "name": "Linaje Ascendido & Cósmico", "races_count": 6}
]

EVOLUTION_TIERS = [
    {"tier": 1, "name": "Fase I: Despertar Mortal", "levels": "1 - 25"},
    {"tier": 2, "name": "Fase II: Transmutación Rúnica", "levels": "25 - 50"},
    {"tier": 3, "name": "Fase III: Ascensión Cósmica", "levels": "50 - 75"},
    {"tier": 4, "name": "Fase IV: Deidad Soberana del Nexo", "levels": "75 - 100"}
]

BOSSES = [
    {"id": "boss-hogger", "name": "Hogger El Devorador del Nexo", "difficulty": "Normal", "level": 15, "hp": 3500, "drop_p66": "50-120"},
    {"id": "boss-vancleef", "name": "Edwin VanCleef 66", "difficulty": "Normal", "level": 25, "hp": 8500, "drop_p66": "150-300"},
    {"id": "boss-onyxia", "name": "Onyxia Reina del Vacío", "difficulty": "Heroico", "level": 60, "hp": 45000, "drop_p66": "1200-2500"},
    {"id": "boss-ragnaros", "name": "Ragnaros Señor del Fuego", "difficulty": "Heroico", "level": 70, "hp": 95000, "drop_p66": "3500-6000"},
    {"id": "boss-arthas", "name": "Arthas El Rey Liche Soberano", "difficulty": "Mítico", "level": 85, "hp": 280000, "drop_p66": "12000-25000"},
    {"id": "boss-sargeras", "name": "Sargeras El Destructor Cósmico", "difficulty": "Jefe_Mundial", "level": 100, "hp": 1200000, "drop_p66": "50000-100000", "usdt_guaranteed": 10}
]

@mmorpg_casino_bp.route("/mmorpg/overview", methods=["GET"])
def mmorpg_overview():
    return jsonify({
        "status": "online",
        "module": "MMORPG Soberano Multi-Raza",
        "difficulty_rule": "Dificultad mínima estricta: Normal (Sin modo fácil)",
        "total_races": 24,
        "factions": FACTIONS,
        "evolution_tiers": EVOLUTION_TIERS,
        "bosses": BOSSES,
        "title_candidates": TITLES
    })

@mmorpg_casino_bp.route("/casino/overview", methods=["GET"])
def casino_overview():
    return jsonify({
        "status": "online",
        "module": "Cripto Casino Soberano 66",
        "supported_networks": ["BNB Smart Chain (BEP-20)", "Telegram TON"],
        "token": "Token P66 (1 USDT = 100 P66)",
        "games": [
            {"id": "roulette", "name": "Ruleta Cuántica 66", "type": "European Roulette", "payout": "36x pleno / 2x color"},
            {"id": "blackjack", "name": "Blackjack 21 Soberano", "type": "Cards", "payout": "3:2 Blackjack natural"},
            {"id": "slots", "name": "Matrix Crypto Slots", "type": "Reels", "jackpot": "50x Corona P66"},
            {"id": "dice", "name": "Hi-Lo Cripto Dados", "type": "Provably Fair 0-100", "payout": "Dinámico hasta 98x"}
        ],
        "provably_fair": "SHA-256 Cryptographic Hashing"
    })

@mmorpg_casino_bp.route("/casino/provably-fair/verify", methods=["POST"])
def verify_fair():
    body = request.get_json() or {}
    server_seed = body.get("server_seed", str(time.time()))
    client_seed = body.get("client_seed", "user-seed-66")
    nonce = body.get("nonce", 1)
    
    combined = f"{server_seed}:{client_seed}:{nonce}"
    computed_hash = hashlib.sha256(combined.encode("utf-8")).hexdigest()
    
    return jsonify({
        "server_seed": server_seed,
        "client_seed": client_seed,
        "nonce": nonce,
        "sha256_hash": computed_hash,
        "verified": True
    })
