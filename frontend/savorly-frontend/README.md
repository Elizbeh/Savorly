# 🥗 Savorly Frontend

**Savorly** is a full-stack recipe management web application that helps users discover, create, save, and share recipes through a secure and responsive interface.

This repository contains the **frontend** of Savorly, built with **React.js and Vite**.

The frontend communicates with a production backend deployed on **AWS EC2**, while the frontend itself is deployed to **GitHub Pages** through GitHub Actions.

---

## 🌐 Live Application

### Frontend

https://Elizbeh.github.io/savorly-frontend

### Backend API

https://savorly.duckdns.org

---

## 🏗️ Deployment Architecture

```text
                    GitHub Repository
                           │
                           │ Push to master
                           ▼
                    GitHub Actions
                           │
                           ▼
                    Build React App
                           │
                           ▼
                     GitHub Pages
                           │
                           │ HTTPS API Requests
                           ▼
                  AWS EC2 Backend
                           │
                           ▼
                    Docker Container
                           │
                           ▼
                     MySQL Database
```

The frontend is automatically built and deployed to **GitHub Pages** whenever changes are pushed to the `master` branch.

The backend is independently deployed through its own CI/CD pipeline using **GitHub Actions, Docker, GitHub Container Registry, and AWS EC2**.

---

## 🧱 Project Structure

```text
savorly-frontend/
│
├── public/
│   └── assets/                 # Static images and icons
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
│   │   └── AuthContext.jsx     # Global authentication state
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
│   ├── App.jsx                 # Application routing and layout
│   ├── index.jsx               # Application entry point
│   ├── App.css
│   └── index.css
│
├── .env.example
├── package.json
└── vite.config.js
```

---

## ✨ Key Features

### 🔐 Authentication

* User registration and login
* Email verification
* JWT authentication
* Secure HTTP cookies
* Protected routes
* Automatic authentication state management

### 👤 User Features

* Personalized home page
* Profile management
* Saved recipes
* Recipe ratings
* Comments

### 🍳 Recipe Management

* Create recipes
* Edit recipes
* Delete recipes
* Recipe categories
* Ingredient management
* Cloudinary image uploads

### 👑 Administration

* Admin dashboard
* User management
* Category management
* Role-based access control

### 🛡️ Security

* HTTPS in local development
* Environment-based configuration
* Secure authentication cookies
* Client-side validation
* Protected routes
* Error boundary handling

---

## 🧰 Technology Stack

| Layer                  | Technology                       |
| ---------------------- | -------------------------------- |
| Frontend               | React.js, Vite, JSX              |
| Routing                | React Router                     |
| State Management       | Context API                      |
| Styling                | CSS3, Flexbox, Responsive Design |
| API Client             | Axios                            |
| Backend                | Node.js, Express.js              |
| Database               | MySQL / TiDB                     |
| Image Storage          | Cloudinary                       |
| Authentication         | JWT, Secure Cookies              |
| Deployment             | GitHub Pages                     |
| CI/CD                  | GitHub Actions                   |
| Backend Infrastructure | AWS EC2                          |
| Containerization       | Docker                           |
| Container Registry     | GitHub Container Registry        |

---

## ⚙️ Environment Configuration

Environment variables are **not committed to Git**.

### Local development

Create `.env.local`:

```env
LOCAL_HTTPS=true
VITE_API_URL=https://savorly.duckdns.org
VITE_CLIENT_URL=https://localhost:5174
```

The local development server runs on:

```text
https://localhost:5174
```

### Production

Production configuration points the frontend to the AWS-hosted backend:

```env
VITE_API_URL=https://savorly.duckdns.org
VITE_CLIENT_URL=https://elizbeh.github.io
```

Production values are provided during the GitHub Actions build process rather than exposing private credentials in the repository.

---

## 💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Elizbeh/savorly-frontend.git
cd savorly-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` with the required local development variables.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
https://localhost:5174
```

---

## 🔐 Routing Overview

| Path                      | Component      | Access     |
| ------------------------- | -------------- | ---------- |
| `/`                       | LandingPage    | Public     |
| `/about`                  | AboutPage      | Public     |
| `/login`                  | Login          | Public     |
| `/register`               | Register       | Public     |
| `/verify-email`           | VerifyEmail    | Public     |
| `/home`                   | HomePage       | Protected  |
| `/create-recipe`          | RecipeFormPage | Protected  |
| `/recipe/:id`             | RecipeDetail   | Public     |
| `/recipe-form/:id`        | RecipeFormPage | Protected  |
| `/categories/:categoryId` | CategoryPage   | Public     |
| `/profile`                | ProfilePage    | Protected  |
| `/saved-recipes`          | SavedRecipes   | Protected  |
| `/admin-dashboard`        | AdminDashboard | Admin Only |

---

## 🔌 Backend Integration

The frontend communicates with the Savorly REST API using Axios.

The API base URL is configured through:

```env
VITE_API_URL
```

Production requests are sent to:

```text
https://savorly.duckdns.org
```

Authentication uses secure cookies and credentials are included with API requests.

The backend handles:

* Authentication
* User accounts
* Recipes
* Categories
* Profiles
* Saved recipes
* Comments
* Ratings
* Image management

---

## 🚀 CI/CD Deployment

Frontend deployment is automated using **GitHub Actions**.

Every push to the `master` branch triggers the deployment workflow:

```text
Push to GitHub
      │
      ▼
GitHub Actions
      │
      ▼
Install Dependencies
      │
      ▼
Build React Application
      │
      ▼
Deploy to GitHub Pages
```

The production build is created with:

```bash
npm run build
```

and deployed using:

```bash
npm run deploy
```

Live application:

https://Elizbeh.github.io/savorly-frontend

---

## ☁️ Production Infrastructure

The frontend and backend are deployed independently.

### Frontend

* GitHub Pages
* GitHub Actions
* Vite production build

### Backend

* AWS EC2
* Docker
* GitHub Container Registry
* GitHub Actions CI/CD

This separation allows the frontend and backend to be deployed independently while communicating through the production REST API.

---

## 🧪 Testing

Testing can be added and expanded using:

* Jest
* React Testing Library

Future improvements include expanding frontend unit and integration test coverage.

---

## 🔗 Related Repository

### Backend

https://github.com/Elizbeh/savorly-backend

### Original Full Project

https://github.com/Elizbeh/Savorly

---

## 🧑‍💻 Author

**Elizabeth Behaghel**

Full-Stack Developer transitioning into **Cloud & DevOps Engineering**.

🎓 Holberton School Graduate
☁️ Cloud & DevOps focused
🐳 Docker & CI/CD
💻 React, Node.js, Python

GitHub:

https://github.com/Elizbeh

---

## 📜 License

MIT License

---

> 💡 Savorly demonstrates a modern full-stack architecture combining React, REST APIs, secure authentication, Docker, GitHub Actions CI/CD, GitHub Container Registry, and AWS cloud deployment.
