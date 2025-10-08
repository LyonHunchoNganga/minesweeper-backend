from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User, Game
import random
from datetime import datetime
from sqlalchemy.orm.attributes import flag_modified

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
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user": {"id": user.id, "username": user.username}}), 201

@bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()
    if user and user.check_password(data["password"]):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"token": access_token, "user": {"id": user.id, "username": user.username}})
    return jsonify({"error": "Invalid credentials"}), 401

# ===== Minesweeper =====
def generate_board(rows, cols, mines):
    board = [[0 for _ in range(cols)] for _ in range(rows)]
    mine_coords = random.sample([(r, c) for r in range(rows) for c in range(cols)], mines)
    for r, c in mine_coords:
        board[r][c] = -1  # Use -1 for mines
    # Calculate numbers
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == -1:
                continue
            count = 0
            for dr in [-1, 0, 1]:
                for dc in [-1, 0, 1]:
                    if dr == 0 and dc == 0:
                        continue
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] == -1:
                        count += 1
            board[r][c] = count
    return board

def flood_fill(revealed, board, r, c, rows, cols):
    if revealed[r][c]:
        return
    revealed[r][c] = True
    if board[r][c] != 0:
        return
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0:
                continue
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                flood_fill(revealed, board, nr, nc, rows, cols)

def check_win(revealed, board, rows, cols, mines):
    revealed_count = sum(sum(row) for row in revealed)
    total_cells = rows * cols
    return revealed_count == total_cells - mines

@bp.route("/games/new", methods=["POST"])
@jwt_required()
def new_game():
    data = request.json
    user_id = get_jwt_identity()
    board = generate_board(data["rows"], data["cols"], data["mines"])
    revealed = [[False for _ in range(data["cols"])] for _ in range(data["rows"])]
    flagged = [[False for _ in range(data["cols"])] for _ in range(data["rows"])]
    game = Game(rows=data["rows"], cols=data["cols"], mines=data["mines"], board_state=board, revealed=revealed, flagged=flagged, user_id=user_id)
    db.session.add(game)
    db.session.commit()
    return jsonify({"game_id": game.id, "board": game.board_state, "revealed": game.revealed, "flagged": game.flagged}), 201

@bp.route("/games/<int:game_id>", methods=["GET"])
@jwt_required()
def get_game(game_id):
    user_id = get_jwt_identity()
    game = Game.query.filter_by(id=game_id, user_id=user_id).first()
    if not game:
        return jsonify({"error": "Game not found"}), 404
    return jsonify({
        "id": game.id,
        "rows": game.rows,
        "cols": game.cols,
        "mines": game.mines,
        "board": game.board_state,
        "revealed": game.revealed,
        "flagged": game.flagged,
        "status": game.status
    })

@bp.route("/games/<int:game_id>/reveal", methods=["POST"])
@jwt_required()
def reveal_cell(game_id):
    user_id = get_jwt_identity()
    game = Game.query.filter_by(id=game_id, user_id=user_id).first()
    if not game:
        return jsonify({"error": "Game not found"}), 404
    if game.status != 'ongoing':
        return jsonify({"error": "Game is already finished"}), 400
    data = request.json
    r, c = data["row"], data["col"]
    if not (0 <= r < game.rows and 0 <= c < game.cols):
        return jsonify({"error": "Invalid coordinates"}), 400
    if game.revealed[r][c] or game.flagged[r][c]:
        return jsonify({"error": "Cell already revealed or flagged"}), 400
    game.revealed[r][c] = True
    if game.board_state[r][c] == -1:
        game.status = 'lost'
        game.end_time = datetime.utcnow()
        # Reveal all mines
        for i in range(game.rows):
            for j in range(game.cols):
                if game.board_state[i][j] == -1:
                    game.revealed[i][j] = True
    else:
        if game.board_state[r][c] == 0:
            flood_fill(game.revealed, game.board_state, r, c, game.rows, game.cols)
        if check_win(game.revealed, game.board_state, game.rows, game.cols, game.mines):
            game.status = 'won'
            game.end_time = datetime.utcnow()
    flag_modified(game, 'revealed')
    db.session.commit()
    return jsonify({
        "revealed": game.revealed,
        "status": game.status
    })

@bp.route("/games/<int:game_id>/flag", methods=["POST"])
@jwt_required()
def flag_cell(game_id):
    user_id = get_jwt_identity()
    game = Game.query.filter_by(id=game_id, user_id=user_id).first()
    if not game:
        return jsonify({"error": "Game not found"}), 404
    if game.status != 'ongoing':
        return jsonify({"error": "Game is already finished"}), 400
    data = request.json
    r, c = data["row"], data["col"]
    if not (0 <= r < game.rows and 0 <= c < game.cols):
        return jsonify({"error": "Invalid coordinates"}), 400
    if game.revealed[r][c]:
        return jsonify({"error": "Cannot flag revealed cell"}), 400
    game.flagged[r][c] = not game.flagged[r][c]
    flag_modified(game, 'flagged')
    db.session.commit()
    return jsonify({
        "flagged": game.flagged
    })