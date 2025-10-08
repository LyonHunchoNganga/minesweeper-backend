from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .models import db
from .routes import bp
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)
    CORS(app, supports_credentials=True)

    app.register_blueprint(bp, url_prefix="/api")

    @app.route("/")
    def index():
        return jsonify({
            "message": "Minesweeper API",
            "version": "1.0",
            "endpoints": {
                "auth": ["/api/signup", "/api/login"],
                "games": ["/api/games/new", "/api/games/<id>", "/api/games/<id>/reveal", "/api/games/<id>/flag"]
            }
        })

    return app