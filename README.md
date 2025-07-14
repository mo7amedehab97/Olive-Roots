# 🌿 Olive-Roots

**Author:** Mohamed Helles

Olive-Roots is a modern, full-stack AI-powered blogging platform built with the MERN stack and TypeScript. It features a beautiful, accessible UI, secure authentication, an advanced admin dashboard, and AI-powered content generation.

---

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router v7, React Hook Form, Zod, TanStack React Query, Quill, Framer Motion
- **Backend:** Node.js, Express 5, MongoDB, Mongoose, Passport.js (JWT), ImageKit, Gemini (Google GenAI), Zod, Helmet, CORS

---

## 📁 Project Structure

```
olive-roots/
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── constants/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── validations/
│       └── server.ts
│
├── backend/
│   └── src/
│       ├── configs/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── validations/
│       └── server.ts
│
└── README.md
```

---

## 🛠️ Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/olive-roots.git
cd olive-roots
```

2. **Install dependencies**

```bash
cd frontend && npm install
cd ../backend && npm install
```

3. **Configure environment variables** (see `.env.example` in each folder)

4. **Start development servers**

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

---

## ✨ Features

- Browse and search blogs by category
- Create and edit blog posts with a rich Quill editor
- AI-powered description generation (Google GenAI)
- JWT-based authentication with persistent login
- Image upload and management via ImageKit
- Newsletter subscription
- Admin dashboard with stats and management tools

---

## 🔐 Admin Routes

- `/admin` — Admin dashboard
- `/admin/blogs` — Manage blogs
- `/admin/blogs/new` — Create blog post
- `/admin/comments` — Moderate comments

---

MIT © Mohamed Helles
