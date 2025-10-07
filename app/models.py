from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    games = db.relationship("Game", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rows = db.Column(db.Integer, nullable=False)
    cols = db.Column(db.Integer, nullable=False)
    mines = db.Column(db.Integer, nullable=False)
    board_state = db.Column(db.JSON, nullable=False)  # 2D array with numbers and -1 for mines
    revealed = db.Column(db.JSON, nullable=False)  # 2D array of booleans
    flagged = db.Column(db.JSON, nullable=False)  # 2D array of booleans
    status = db.Column(db.String(20), default='ongoing')  # 'ongoing', 'won', 'lost'
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)