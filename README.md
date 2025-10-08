# Minesweeper API

A RESTful API for a Minesweeper game built with Flask, featuring user authentication and game management.

## Features

- User registration and login with JWT authentication
- Create and manage Minesweeper games
- Reveal cells and flag/unflag mines
- Persistent game state with SQLite database
- CORS support for frontend integration

## Technologies

- **Flask**: Web framework
- **Flask-SQLAlchemy**: Database ORM
- **Flask-Migrate**: Database migrations
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd minesweeper-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables (optional):
   Create a `.env` file in the root directory:
   ```
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   DATABASE_URL=sqlite:///instance/minesweeper.db
   ```

## Database Setup

1. Set the Flask app:
   ```bash
   export FLASK_APP=app  # On Windows: set FLASK_APP=app
   ```

2. Initialize and upgrade the database:
   ```bash
   flask db upgrade
   ```

## Running the Application

Start the development server:
```bash
python main.py
```

The API will be available at `http://localhost:5000`

## Frontend

The frontend is a React application located in the `minesweeper/` directory.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd minesweeper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Frontend

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

## API Endpoints

### Root
- `GET /` - API information and available endpoints

### Authentication
- `POST /api/signup` - Register a new user
  - Body: `{"username": "string", "password": "string"}`
- `POST /api/login` - Login user
  - Body: `{"username": "string", "password": "string"}`
  - Returns: JWT token

### Games (Require JWT authentication)
- `POST /api/games/new` - Create a new game
  - Body: `{"rows": int, "cols": int, "mines": int}`
- `GET /api/games/<game_id>` - Get game state
- `POST /api/games/<game_id>/reveal` - Reveal a cell
  - Body: `{"row": int, "col": int}`
- `POST /api/games/<game_id>/flag` - Flag/unflag a cell
  - Body: `{"row": int, "col": int}`

## Usage Example

1. Register a user:
   ```bash
   curl -X POST http://localhost:5000/api/signup \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass"}'
   ```

2. Login to get token:
   ```bash
   curl -X POST http://localhost:5000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass"}'
   ```

3. Create a game (include token in Authorization header):
   ```bash
   curl -X POST http://localhost:5000/api/games/new \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"rows": 9, "cols": 9, "mines": 10}'
   ```

## Project Structure

```
minesweeper-backend/
├── app/
│   ├── __init__.py      # Flask app factory
│   ├── config.py        # Configuration settings
│   ├── models.py        # Database models
│   └── routes.py        # API routes
├── minesweeper/         # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── migrations/          # Database migrations
├── instance/            # Database files
├── main.py              # Application entry point
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## License

This project is licensed under the MIT License.