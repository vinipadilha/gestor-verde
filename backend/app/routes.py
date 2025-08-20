# app/routes.py

from app import app
from app.models import get_db_connection
from flask import request, jsonify

# Rota para CRIAR (CREATE) um novo produto
@app.route('/api/produto', methods=['POST'])
def create_produto():
    data = request.get_json()
    nome = data['proNome']
    quantidade = data['proQtd']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO produto (proNome, proQtd) VALUES (%s, %s)", (nome, quantidade))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Produto criado com sucesso!"}), 201

# Rota para LER (READ) todos os produtos
@app.route('/api/produto', methods=['GET'])
def get_produtos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM produto")
    produtos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(produtos)

# Rota para ATUALIZAR (UPDATE) um produto
@app.route('/api/produto/<int:proId>', methods=['PUT'])
def update_produto(proId):
    data = request.get_json()
    nome = data['proNome']
    quantidade = data['proQtd']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE produto SET proNome = %s, proQtd = %s WHERE proId = %s", (nome, quantidade, proId))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Produto atualizado com sucesso!"})

# Rota para DELETAR (DELETE) um produto
@app.route('/api/produto/<int:proId>', methods=['DELETE'])
def delete_produto(proId):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM produto WHERE proId = %s", (proId,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Produto deletado com sucesso!"})