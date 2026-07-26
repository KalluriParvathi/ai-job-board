# AI Job Board

An AI-powered Job Board application built using FastAPI and React.

## Features

- User Registration
- User Login (JWT Authentication)
- AI Job Description Generator
- Add Jobs
- Update Jobs
- Delete Jobs
- Search Jobs
- Responsive UI
- GitHub Actions CI/CD
- Vercel Deployment

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router DOM

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Passlib
- Python

## Project Structure

```
ai-job-board/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── schemas.py
│   ├── security.py
│   ├── auth.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── .github/workflows/
```

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication

POST /register

POST /login

### Jobs

GET /jobs

POST /jobs

PUT /jobs/{id}

DELETE /jobs/{id}

### AI

GET /generate/{title}

## CI/CD

GitHub Actions automatically:

- Installs dependencies
- Builds React application
- Installs Python packages
- Verifies backend

## Deployment

Frontend deployed using Vercel.

## Future Improvements

- User Profiles
- File Upload
- AI Resume Matching
- Email Notifications
- PostgreSQL Integration

## Author

Kalluri Parvathi
