# app/__init__.py

from flask import Flask

# Inicializa o objeto Flask
app = Flask(__name__)

# Importa as rotas para que sejam registradas na aplicação
from app import routes