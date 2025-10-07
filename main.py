from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.models import db
from app.routes import bp
from app.config import Config

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

if __name__ == "__main__":
    app.run(debug=True)