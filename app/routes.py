from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User, Game
import random

bp = Blueprint("api", __name__)

# ===== Auth =====
@bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 422
    user = User(username=data["username"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": {"id": user.id, "username": user.username}}), 201

@bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()
    if user and user.check_password(data["password"]):
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "user": {"id": user.id, "username": user.username}})
    return jsonify({"error": "Invalid credentials"}), 401

# ===== Minesweeper =====
def generate_board(rows, cols, mines):
    board = [[0 for _ in range(cols)] for _ in range(rows)]
    mine_coords = random.sample([(r, c) for r in range(rows) for c in range(cols)], mines)
    for r, c in mine_coords:
        board[r][c] = "M"
    return board

@bp.route("/games/new", methods=["POST"])
@jwt_required()
def new_game():
    data = request.json
    user_id = get_jwt_identity()
    board = generate_board(data["rows"], data["cols"], data["mines"])
    game = Game(rows=data["rows"], cols=data["cols"], mines=data["mines"], board_state=board, user_id=user_id)
    db.session.add(game)
    db.session.commit()
    return jsonify({"game_id": game.id, "board": game.board_state}), 201