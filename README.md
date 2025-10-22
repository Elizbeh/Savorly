🧩 Savorly --- Full-Stack Recipe Management Application
=====================================================

**Savorly** is a secure, full-stack recipe management web application that allows users to discover, create, save, and share their favorite recipes through an intuitive and responsive interface.

This main repository (`savorly/`) contains **the complete project source code** --- both the frontend (React.js) and backend (Node.js + MySQL/TiDB) --- as originally developed during training at Holberton School.\
The active and CI/CD-integrated versions of the frontend and backend are maintained in their respective repositories below.

* * * * *

🌐 Live Demo
------------

-   **Frontend (React + Vite):**\
    🔗 <https://Elizbeh.github.io/savorly-frontend>

-   **Backend API (Node.js + Express + MySQL/TiDB):**\
    ⚙️ <https://savorly-backend-c6hu.onrender.com>

* * * * *

📦 Repository Links
-------------------

| Layer                         | Repository                                                              | Deployment |
| ------------------------------| ----------------------------------------------------------------------- | ---------- |
| **Frontend**                  | [Elizbeh/savorly-frontend](https://github.com/Elizbeh/savorly-frontend) | GitHub Pages      |
| **Backend**                   | [Elizbeh/savorly-backend](https://github.com/Elizbeh/savorly-backend)   | Render     |
| **Full Project (this repo)**  | [Elizbeh/Savorly](https://github.com/Elizbeh/Savorly)                   | ---        |

* * * * *

🧱 Project Architecture
-----------------------

```savorly/
├── backend/                  # Backend (Node.js + Express + MySQL/TiDB)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── migrations/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
├── frontend/                 # Folder for frontend
│   └── savorly-frontend/     # Actual frontend project (React.js + Vite)
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
└── README.md                 # General project overview (this file)
```

* * * * *

💡 Main Features
----------------

✅ **Secure Authentication**

-   Login, Register, and Email Verification

-   JWT + Secure HTTP-only cookies

-   Role-based access (User / Admin)

✅ **Recipe Management**

-   Create, edit, delete, and view recipes

-   Cloudinary integration for image uploads

-   Commenting and rating system

✅ **User Dashboard**

-   Profile management (update info and avatar)

-   Saved recipes section

-   Personalized home feed

✅ **Admin Dashboard**

-   Manage users, categories, and reported content

✅ **Responsive UI & Accessibility**

-   Mobile-first layout

-   Navigation optimized for keyboard and touch

-   Accessible form elements and semantic markup

✅ **Security & Deployment**

-   Sanitized SQL queries (MySQL2 prepared statements)

-   `helmet`, `xss-clean`, `express-rate-limit` middleware

-   CI/CD pipelines for automated testing and deployment

* * * * *

🧰 Tech Stack
-------------

| Layer             | Technologies                                      |
| ----------------- | ------------------------------------------------- |
| **Frontend**      | React.js (Vite), React Router, Context API, CSS3  |
| **Backend**       | Node.js, Express.js                               |
| **Database**      | MySQL / TiDB                                      |
| **Authentication**| JWT, bcryptjs, Secure Cookies                     |
| **Storage**       | Cloudinary                                        |
| **Email**         | Nodemailer (verification)                         |
| **Security**      | Helmet, XSS-Clean, Rate-Limit                     |
| **Testing**       | Jest, Supertest                                   |
| **Deployment**    | GitHub Pages (Frontend), Render (Backend)         |
| **CI/CD**         | GitHub Actions                                    |

* * * * *

⚙️ Setup Overview
-----------------

### 🧩 Local Installation

1️⃣ **Clone the main repo**

`git clone https://github.com/Elizbeh/Savorly.git
cd savorly`

2️⃣ **Install dependencies** for both layers:

`cd savorly-end && npm install
cd ../savorly-backend && npm install`

3️⃣ **Configure environment variables** in each folder (`.env` files):\
Frontend → `.env` with `VITE_API_URL` and `VITE_CLIENT_URL`\
Backend → `.env` with DB credentials, JWT secrets, and Cloudinary keys

4️⃣ **Run the apps**

`# Backend
cd backend
npm run dev

# Frontend
cd ../savorly-frontend
npm run dev`

* * * * *

🧪 Continuous Integration & Deployment
--------------------------------------

Both the frontend and backend are managed independently for deployment:

-   **Frontend CI/CD:**\
    GitHub Actions → GitHub Pages (`main` branch)\
    Builds automatically and deploys static assets via `gh-pages`.

-   **Backend CI/CD:**\
    GitHub Actions → Render deployment.\
    Workflow includes migrations, seeders, and automated tests.

* * * * *

🔒 Security Highlights
----------------------

-   HTTPS-only communication

-   Environment-isolated credentials

-   Rate limiting and input sanitization

-   Secure token storage with cookies

-   Server-side validation using Joi

-   Role-based route protection (Admin/User)

* * * * *

🧭 Documentation Links
----------------------

-   🖥️ [Frontend README (savorly-frontend)](https://github.com/Elizbeh/savorly-frontend/blob/main/README.md)

-   ⚙️ [Backend README (savorly-backend)](https://github.com/Elizbeh/savorly-backend/blob/main/README.md)

* * * * *

🧑‍💻 Author
------------

**Elizabeth**\
🎓 Full-Stack Developer --- Holberton School Graduate\
💡 Focused on secure, scalable, and user-friendly web applications\
🌍 [GitHub Profile](https://github.com/Elizbeh)

* * * * *

📜 License
----------

This project is released under the **MIT License**.

* * * * *

> 💬 *Savorly is the result of a full-stack development training project, later refactored into separate frontend and backend repositories with automated CI/CD integration. This main repository serves as the complete reference and documentation hub for the project.*