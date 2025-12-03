# Lunar Social TMA

This is a Monorepo containing the Frontend and Backend for the Lunar Social Telegram Mini App.

## Project Structure

- **frontend/**: A React application built with Vite and TypeScript.
- **backend/**: A Laravel 11 application tailored for E-commerce (Lunar).

## Getting Started

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

### Backend

Navigate to the backend directory:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
