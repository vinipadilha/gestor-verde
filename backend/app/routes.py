# app/routes.py

from app import app
from flask import jsonify

@app.route('/')
def index():
    return "Bem-vindo ao Backend do Gestor Verde!"

@app.route('/api/score', methods=['GET'])
def get_score():
    # Esta rota pode retornar a pontuação do jogo, por exemplo
    return jsonify({"score": 10})