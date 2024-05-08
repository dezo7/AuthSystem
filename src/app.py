import os
import jwt
from datetime import datetime, timedelta, timezone
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app)  # Aplica CORS a todas las rutas

app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_default_secret_key')  # Usa una clave secreta desde env o una por defecto

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

setup_admin(app)
setup_commands(app)

app.register_blueprint(api, url_prefix='/api')

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing email or password"}), 400
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "Email already exists"}), 400
    new_user = User(email=data['email'], password=data['password'], is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing email or password"}), 400
    user = User.query.filter_by(email=data['email']).first()
    if user and user.password == data['password']:  # Considere usar bcrypt aquí
        # Genera el token JWT
        token = jwt.encode({
            'sub': user.email,  # sub es el sujeto del token
            'iat': datetime.now(timezone.utc),  # iat es la hora en que se emitió el token
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)  # expira en 24 horas
        }, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)