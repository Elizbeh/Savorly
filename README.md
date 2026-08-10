# 🧩 Savorly — Full-Stack Recipe Management Application

**Savorly** is a secure, full-stack recipe management web application that allows users to discover, create, save, and share recipes through an intuitive and responsive interface.

This repository is the **original full-project repository** created during my training at Holberton School. It contains the original frontend and backend source code from the development of Savorly. This code is preserved for reference and is not the actively maintained production codebase.

The project has since been **refactored into two dedicated repositories** with independent CI/CD pipelines and deployments:

* 🖥️ **Frontend** → React.js + Vite → GitHub Pages
* ⚙️ **Backend** → Node.js + Express + MySQL → AWS EC2

> 🚀 **The live application is powered by the separate frontend and backend repositories linked below. This repository serves as the original project reference and gateway to the actively maintained codebases.**

---

## 🌐 Live Application

### 🍳 Savorly

**Frontend:**
https://Elizbeh.github.io/savorly-frontend

**Backend API:**
https://savorly.duckdns.org

The frontend communicates with the production backend through the REST API.

---

## 🔗 Active Repositories

| Component                    | Repository                                                      | Deployment                |
| ---------------------------- | --------------------------------------------------------------- | ------------------------- |
| 🖥️ **Frontend**             | [savorly-frontend](https://github.com/Elizbeh/savorly-frontend) | GitHub Pages              |
| ⚙️ **Backend**               | [savorly-backend](https://github.com/Elizbeh/savorly-backend)   | AWS EC2                   |
| 🧩 **Original Full Project** | **This repository**                                             | Reference / Documentation |

### 👉 Start here

**Want to see the live application?**
➡️ [Open Savorly](https://Elizbeh.github.io/savorly-frontend)

**Want to explore the frontend code and deployment?**
➡️ [Frontend Repository](https://github.com/Elizbeh/savorly-frontend)

**Want to explore the backend, Docker and CI/CD?**
➡️ [Backend Repository](https://github.com/Elizbeh/savorly-backend)

---

## 🏗️ Current Architecture

```text
                         SAVORLY
                            │
                            ▼
                  ┌──────────────────┐
                  │  React Frontend  │
                  │   Vite + React   │
                  └────────┬─────────┘
                           │
                           │ HTTPS / REST API
                           ▼
                  ┌──────────────────┐
                  │  Node.js Backend │
                  │ Express + JWT    │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │      MySQL       │
                  │    Database      │
                  └──────────────────┘

Frontend → GitHub Pages
Backend  → Docker → GHCR → AWS EC2
                         ↑
                    Terraform
                         │
                    Amazon S3
                  (remote state)
```

The frontend and backend are now maintained and deployed independently.

---

## 📚 Original Project Structure

The original repository contains the project structure used during development:

```text
Savorly/
├── backend/
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
├── frontend/
│   └── savorly-frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
└── README.md
```

> **Note:** The actively maintained frontend and backend are now located in their dedicated repositories linked above.

---

## 💡 Main Features

### 🔐 Authentication

* User registration and login
* Email verification
* JWT authentication
* Refresh tokens
* Secure HTTP-only cookies
* Role-based access control

### 🍲 Recipe Management

* Create recipes
* Edit recipes
* Delete recipes
* Browse recipes
* Categories
* Ingredients
* Cloudinary image uploads
* Ratings and comments

### 👤 User Features

* User profiles
* Profile updates
* Saved recipes
* Personalized recipe feed

### 🛡️ Security

* JWT authentication
* Secure cookies
* Helmet
* XSS protection
* Rate limiting
* Joi validation
* Parameterized SQL queries
* Environment-based configuration

---

## 🧰 Technology Stack

### Frontend

* React.js
* Vite
* React Router
* Context API
* CSS3

### Backend

* Node.js
* Express.js
* MySQL
* JWT
* bcryptjs
* Nodemailer
* Cloudinary

### Testing

* Jest
* Supertest

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)
- AWS EC2
- Terraform
- Amazon S3 (Terraform remote state)
- Infrastructure as Code (IaC)
- Automated CI/CD
- Health-check-based deployment rollback

---

## 🚀 Current CI/CD Architecture

The project has evolved from a single full-stack repository into independently deployed frontend and backend applications.

### Frontend

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ▼
Build React Application
   │
   ▼
Deploy to GitHub Pages
```

➡️ [Frontend Repository](https://github.com/Elizbeh/savorly-frontend)

### Backend

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Run Tests
   ├── Run Database Migrations
   ├── Build Docker Image
   │
   ▼
GitHub Container Registry
   │
   ▼
AWS EC2
   │
   ▼
Docker Container
   │
   ▼
Health Check
   │
   ├── PASS → Deployment successful
   │
   └── FAIL → Automatic rollback
```

➡️ [Backend Repository](https://github.com/Elizbeh/savorly-backend)

---

## 📖 Documentation

For the latest implementation and deployment documentation, see:

### 🖥️ Frontend

[Frontend README](https://github.com/Elizbeh/savorly-frontend/blob/master/README.md)

### ⚙️ Backend / DevOps

[Backend README](https://github.com/Elizbeh/savorly-backend/blob/master/README.md)

The backend repository contains the most detailed DevOps documentation, including Docker, CI/CD, GitHub Container Registry, AWS deployment, Terraform Infrastructure as Code, remote Terraform state, health checks and automatic rollback.

---

## 🎓 Project Evolution

Savorly originally started as a single full-stack project during my Full-Stack development training.

As the project evolved, I separated the frontend and backend into independent repositories to improve:

* Deployment independence
* CI/CD workflows
* Environment management
* Dockerization
* Cloud deployment
* Backend scalability
* DevOps practices

The result is now a production-style architecture where the frontend and backend are independently built, tested, containerized and deployed.

---

## 🧑‍💻 Author

**Elizabeth Behaghel**

Full-Stack Developer transitioning into **Cloud & DevOps Engineering**.

[GitHub Profile](https://github.com/Elizbeh)

---

## 📜 License

This project is released under the **MIT License**.

---

> 💡 **Savorly started as a full-stack development project and evolved into a separately deployed frontend and backend application. This repository remains the original project reference and serves as the gateway to the actively maintained repositories.**
