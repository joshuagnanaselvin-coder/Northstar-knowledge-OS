# Installation Guide

**Last Updated:** 2026-08-09
**Prerequisites:** Node.js 18+, Python 3.10+, Docker & Docker Compose (optional)

---

## Option 1: Docker Compose (Recommended for Quick Start)

This is the fastest way to get the full stack running with both backend and frontend.

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd northstar-knowledge-os
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:8000`
   - API Health Check: `http://localhost:8000/api/health`

4. **Default users (seeded automatically):**

   | Name | Role | Password |
   |------|------|----------|
   | Alice Chen | Admin | (none — name-based login) |
   | Marcus Johansson | Leader | (none) |
   | Sarah Patel | Leader | (none) |
   | David Okafor | Champion | (none) |
   | Elena Rodriguez | Employee | (none) |
   | James Mueller | Employee | (none) |
   | Jordan Taylor | Community Member | (none) |

5. **Stop services:**
   ```bash
   docker-compose down
   ```

   **Note:** The SQLite database persists in the `northstar-data` Docker volume. To reset data:
   ```bash
   docker-compose down -v
   ```

---

## Option 2: Manual Setup (Backend Only)

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)

### Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   ```bash
   # Windows (Git Bash / WSL):
   source venv/Scripts/activate

   # Windows (PowerShell):
   venv\Scripts\Activate.ps1

   # macOS / Linux:
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   Dependencies:
   - `fastapi` — Web framework
   - `uvicorn[standard]` — ASGI server
   - `sqlalchemy` — ORM
   - `python-multipart` — Form data parsing

5. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Verify the server is running:**
   ```bash
   curl http://localhost:8000/api/health
   # Expected: {"status":"ok","service":"NorthStar Knowledge OS"}
   ```

7. **Access API documentation:**
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

---

## Option 3: Manual Setup (Frontend Only)

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (optional):**
   
   Create a `.env` file in the `frontend/` directory:
   ```
   VITE_API_URL=http://localhost:8000
   ```

   If not set, the Vite dev server proxies `/api` to `http://localhost:8000` automatically.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - `http://localhost:5173` (default Vite port)

---

## Option 4: Full Stack Manual Setup

Run both backend and frontend simultaneously.

### Terminal 1 — Backend:
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # or venv\Scripts\Activate.ps1 on PowerShell
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2 — Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Access:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## Environment Variables

### Backend
No environment variables are currently required. The database URL is hardcoded to SQLite (`northstar.db` in the working directory).

**Future (planned):**
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `sqlite:///./northstar.db` |
| `SECRET_KEY` | JWT signing secret | (required for production) |
| `OPENAI_API_KEY` | OpenAI API key for LLM integration | (none) |
| `ANTHROPIC_API_KEY` | Anthropic API key for LLM integration | (none) |
| `CORS_ORIGINS` | Comma-separated allowed origins | `*` |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | Proxied to `localhost:8000` |

---

## Troubleshooting

### Backend won't start — "port already in use"
```bash
# Windows — find and kill process on port 8000:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use a different port:
uvicorn main:app --reload --port 8001
```

### Frontend can't connect to backend
- Ensure the backend is running on port 8000
- Check that `VITE_API_URL` is set correctly, or remove it to use the Vite proxy
- Check CORS settings in `backend/main.py`

### Database is empty or corrupted
The seed data runs automatically on every server startup. If data appears wrong:
1. Stop the server
2. Delete `northstar.db` (or the Docker volume with `docker-compose down -v`)
3. Restart — seed data will be recreated

### Docker Compose "permission denied" on Windows
Ensure Docker Desktop is running and WSL 2 integration is enabled. Right-click the Docker Desktop icon → Settings → Resources → WSL Integration → enable your distro.

### npm install fails with "engines" error
Ensure you are using Node.js 18 or higher:
```bash
node --version
# Should show v18.x.x or higher
```

---

## Production Deployment

For production deployment instructions, see `cloudbuild.yaml` and the Dockerfile configurations. The recommended production stack is:

1. **Backend:** Deployed to Google Cloud Run via Cloud Build
2. **Database:** Cloud SQL for PostgreSQL with pgvector
3. **Frontend:** Static files served from Cloud Storage + Cloud CDN
4. **Secrets:** Google Secret Manager for API keys and database credentials

See the `cloudbuild.yaml` file for the automated CI/CD pipeline configuration.
