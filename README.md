# Cafiator - Chase Your Aesthetics ☕✨

**Cafiator** is a modern cafe discovery application designed for Tamil Nadu. It helps users find cafes based on "vibe" (aesthetic, couple-friendly, hidden gems), city, and location. The platform features a sleek, dark-mode specialized UI, real-time geolocation, and a community-driven review system.

## 🚀 Features

- **Nearby Discovery**: Find cafes within a 5km radius using geolocation.
- **Smart Filtering**: Filter by City (Chennai, Coimbatore, etc.) or Vibe (Aesthetic, Work-Friendly, etc.).
- **Interactive Reviews**: Users can submit ratings, comments, and photos (using Gravatar/DiceBear avatars).
- **Admin Dashboard**: Manage cafe submissions and verification.
- **Data Integration**: Hybrid data approach using local database + OpenStreetMap (Overpass API) for dynamic discovery.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: SQLite / PostgreSQL (via SQLAlchemy)
- **Validation**: Pydantic
- **Data Processing**: Pandas, OpenPyXL
- **Configuration**: Python-Dotenv
- **Data Source**: OpenStreetMap (Overpass API) via `cafedata.py` utilities.

## 📦 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a `.env` file:
```bash
# .env
DATABASE_URL=sqlite:///./cafes.db
# OR
# DATABASE_URL=postgresql://user:password@localhost/dbname
```

Create a virtual environment:
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
python main.py
```
*The API will be available at `http://localhost:8001`.*

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Create a `.env` file:
```bash
# .env
VITE_API_BASE_URL=http://localhost:8001
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
*The app will be available at `http://localhost:5173`.*

## 📖 API Documentation

Once the backend is running, you can access the interactive API docs at:
- **Swagger UI**: [http://localhost:8001/docs](http://localhost:8001/docs)
- **ReDoc**: [http://localhost:8001/redoc](http://localhost:8001/redoc)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
