🧩 README for `savorly-frontend`
-------------------------------
`# 🥗 Savorly Frontend

**Savorly** is a full-stack recipe management web application that helps users discover, create, save, and share their favorite recipes --- all within a secure, responsive interface.

This repository contains the **frontend** of Savorly, built with **React.js (Vite)** and integrated with the [Savorly Backend API](https://savorly-backend-c6hu.onrender.com).
The frontend is deployed via **GitHub Pages** and includes authentication, admin access, and interactive UI features.

---

## 🌐 Live Demo

👉 **Frontend:** [https://elizbeh.github.io/savorly-end](https://Elizbeh.github.io/savorly-frontend)
⚙️ **Backend API:** [https://savorly-backend-c6hu.onrender.com](https://savorly-backend-c6hu.onrender.com)

---

## 🧱 Project Structure

```
savorly-frontend/
├── public/
│   └── assets/             # Static images, icons
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── RecipeDetail.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ErrorBoundary.jsx
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx   # Handles global user state and authentication
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Home.jsx
│   │   ├── RecipeFormPage.jsx
│   │   ├── Profile.jsx
│   │   ├── SavedRecipes.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CategoryPage.jsx
│   │   └── AboutPage.jsx
│   │
│   ├── App.jsx               # Routing and layout
│   ├── index.jsx             # Application entry point
│   ├── App.css               # Global styling
│   └── index.css
│
├── .env.example              # Example environment variables
├── package.json
└── vite.config.js ```

* * * * *

💡 Key Features
---------------

✅ **Secure Authentication**

-   Login, Register, and Email Verification

-   JWT + Secure cookies (handled by backend)

-   Protected routes using `ProtectedRoute` component

✅ **User Dashboard**

-   Personalized Home with categories and tips

-   Profile management (view and edit info)

-   Saved Recipes (add/remove/view)

✅ **Recipe Management**

-   Create, edit, and delete recipes

-   Cloudinary image upload

-   Recipe detail page with comments and ratings

✅ **Admin Dashboard**

-   Manage users and categories

-   Role-based access control via AuthContext

✅ **Modern UI**

-   Fully responsive design

-   Reusable components (Navbar, Footer, Cards)

-   Error handling via `ErrorBoundary`

✅ **Security & Performance**

-   HTTPS-only environment

-   Environment variables for API URLs

-   Client-side input validation

* * * * *

🧰 Tech Stack
-------------

| Layer | Technology |
| --- | --- |
| **Frontend** | React.js (Vite), JSX, React Router |
| **State Management** | Context API |
| **Styling** | CSS3, Flexbox, custom responsive design |
| **Backend API** | Node.js, Express, MySQL (TiDB) |
| **Deployment** | GitHub Pages (Frontend), Render (Backend) |
| **Version Control** | Git / GitHub |
| **Auth Security** | JWT, Secure Cookies |
| **Testing (planned)** | React Testing Library, Jest |

* * * * *

⚙️ Environment Configuration
----------------------------

Create a `.env` file in the root directory (not committed to Git):

`LOCAL_HTTPS=true

# Backend API URL (production or local)
VITE_API_URL=https://savorly-backend-c6hu.onrender.com

# Frontend base URL
VITE_CLIENT_URL=https://Elizbeh.github.io`

* * * * *

🧪 Local Setup
--------------

### 1️⃣ Clone the repo

`git clone https://github.com/Elizbeh/savorly-frontend.git
cd savorly-end`

### 2️⃣ Install dependencies

`npm install`

### 3️⃣ Set up your `.env` file

Refer to the section above and configure your environment variables.

### 4️⃣ Run the development server

`npm run dev`

Frontend will start on\
👉 `https://localhost:5174` (with HTTPS)

* * * * *

🔐 Routing Overview
-------------------

| Path | Component | Access |
| --- | --- | --- |
| `/` | LandingPage | Public |
| `/about` | AboutPage | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/verify-email` | VerifyEmail | Public |
| `/home` | HomePage | Protected |
| `/create-recipe` | RecipeFormPage | Protected |
| `/recipe/:id` | RecipeDetail | Public |
| `/recipe-form/:id` | RecipeFormPage | Protected |
| `/categories/:categoryId` | CategoryPage | Public |
| `/profile` | ProfilePage | Protected |
| `/saved-recipes` | SavedRecipes | Protected |
| `/admin-dashboard` | AdminDashboard | Admin Only |

* * * * *

🧩 Integration with Backend
---------------------------

The frontend communicates with the backend via REST API calls using the base URL defined in your `.env` file:

`VITE_API_URL=https://savorly-backend-c6hu.onrender.com`

All authentication and data operations (recipes, profiles, comments, ratings) are securely handled via the backend's endpoints.\
The frontend uses **secure cookies** to maintain sessions and `ProtectedRoute` to block unauthorized access.

* * * * *

🚀 Deployment
-------------

Deployed using **GitHub Pages** with automatic CI/CD from the `main` branch.

`npm run build
npm run deploy`

Your production site will be available at:\
👉 https://Elizbeh.github.io/savorly-end

* * * * *

🧑‍💻 Author
------------

**Elizabeth** -- Full-Stack Developer\
🎓 Graduate of Holberton School\
🔐 Focused on secure, scalable web application development.\
🌍 [GitHub Profile](https://github.com/Elizbeh)

* * * * *

📜 License
----------

This project is licensed under the **MIT License**.

* * * * *

> 💡 This frontend is the client part of the Savorly project.\
> To view the backend (API + database + CI/CD):\
> 🔗 [Savorly Backend Repository](https://github.com/Elizbeh/savorly-backend)