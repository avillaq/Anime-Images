# Anime Random Images

A web application for exploring and collecting anime images. Allows users to browse different categories, save their favorites and download images.

![Home](screenshots/home.png)
![ImageViewer](screenshots/imageViewer.png)
![Favorites](screenshots/favorites.png)

## ✨ Features

- 🖼️ Random anime image exploration
- 🏷️ Multiple categories
- ❤️ Favorites system for registered users
- ⬇️ Image downloads
- 🔒 User authentication
- 🌓 Two content modes: SFW and NSFW

## 🛠️ Technologies

### Frontend
- React 18
- NextUI
- Zustand (state management)
- Axios (HTTP requests)
- React Router DOM
- Tailwind CSS

### Backend
- Flask
- PostgreSQL or MySQL
- Flask-Praetorian (JWT)
- SQLAlchemy

## 📝 Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL

## 🚀 Installation

1. **Clone repository**
```bash
git clone https://github.com/avillaq/Anime-Images.git
cd Anime-Images
```

2. **Setup Backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure Backend environment variables**
Create a `.env` file in the `backend` folder and add:
```bash
SECRET_KEY=your-random-secret-key
SQLALCHEMY_DATABASE_URI=postgresql://user:password@host:port/database_name
DEVELOPMENT_HOST=http://localhost:5173
```

4. **Setup Frontend**
```bash
cd frontend
npm install
```

5. **Configure Frontend environment variables**
Create a `.env` file in the `frontend` folder and add:
```bash
VITE_API_URL=http://localhost:5000/api
```

## 🎮 Usage
1. **Start Backend**
```bash
cd backend
flask run
```

2. **Start Frontend**
```bash
cd frontend
npm run dev
```

3. **Open `http://localhost:5173` in browser**

## 📊 Used APIs
- [Waifu.im](https://docs.waifu.im/)
- [Waifu.pics](https://waifu.pics/docs)

## 📄 License
This project is under MIT License. See `LICENSE` file for details.

## 👤 Author
Alexander VQ - [@avillaq](https://github.com/avillaq)