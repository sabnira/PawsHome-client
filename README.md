# 🐾 PawsHome

**PawsHome** is a full-stack pet adoption platform that connects loving families with pets in need. Users can browse and search pets, submit adoption requests, create donation campaigns, and donate securely online.

> Built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

---

## 🔗 Live Demo

- **Live Site:** `https://your-live-site-link.com`
- **Client Repository:** `https://github.com/sabnira/your-client-repo`
- **Server Repository:** `https://github.com/sabnira/your-server-repo`

---

## ✨ Features

- 🔐 **Authentication** – Email/password and social login with Firebase, with JWT-secured API routes
- 🐶 **Pet Listing** – Browse pets with infinite scroll, debounced search, and category filtering
- 📄 **Pet Details** – View full pet information and submit an adoption request
- 📝 **Adoption Requests** – Send, track, accept, or reject adoption requests
- 💝 **Donation Campaigns** – Create and manage campaigns, and view campaign details
- 💳 **Secure Payments** – Donations processed through Stripe
- 🎠 **Banner Carousel** – Image sliders built with Keen Slider
- 🧭 **Protected Routes** – Private pages accessible only to logged-in users
- 📱 **Fully Responsive** – Works on mobile, tablet, and desktop
- 🔔 **Alerts & Confirmations** – Friendly dialogs with SweetAlert2
- 🔍 **Dynamic Page Titles** – Managed with React Helmet Async

---

## 🛠️ Tech Stack

### Languages
JavaScript, HTML5, CSS3

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | UI library and dev server/build tool |
| Tailwind CSS + DaisyUI | Responsive styling and prebuilt components |
| React Router DOM | Page navigation and protected routes |
| TanStack Query | Fetching, caching, and managing server data |
| Axios | HTTP requests to the backend |
| React Hook Form | Form handling and validation |
| React Icons | Icons across the interface |
| SweetAlert2 | Alerts and confirmation dialogs |
| Keen Slider | Sliders and carousels |
| React Helmet Async | Page metadata management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server, REST APIs, and application logic |
| MongoDB | Database for pets, adoption requests, donations, campaigns, and users |
| JWT | Securing protected API requests |

### Services
| Service | Purpose |
|---|---|
| Firebase Authentication | Email/password and Google sign-in |
| Stripe | Donation and payment processing |

---

## 📁 Project Structure

```
pawshome/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/          # useAxiosPublic, useAxiosSecure, useAuth
│   │   ├── layouts/        # MainLayout, DashboardLayout
│   │   ├── pages/
│   │   ├── providers/      # AuthProvider
│   │   ├── routes/         # Router & PrivateRoute
│   │   └── main.jsx
│   └── package.json
│
└── server/                 # Node + Express backend
    ├── index.js
    └── package.json
```

> Adjust folder names to match your actual project.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or later)
- A MongoDB database (Atlas or local)
- A Firebase project
- A Stripe account

### 1. Clone the repositories

```bash
git clone https://github.com/sabnira/your-client-repo.git
git clone https://github.com/sabnira/your-server-repo.git
```

### 2. Set up the client

```bash
cd client
npm install
```

Create a `.env.local` file in the client root:

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_STRIPE_PK=your_stripe_publishable_key
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

### 3. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in the server root:

```env
PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start the server:

```bash
npm start
```

---

## 🔒 Security

- JWT verification on protected API routes
- Role-based access for protected actions
- Environment variables used for all secrets (never committed to Git)

---

## 🚀 Deployment

- **Client:** Firebase Hosting / Netlify / Vercel
- **Server:** Vercel / Render

---

## 🔮 Future Improvements

- Real-time chat between adopters and pet owners
- Email notifications for adoption updates
- Advanced pet filters (age, breed, location)
- Admin analytics dashboard

---

## 👩‍💻 Author

**Sabnira Afrin Jemi**

- GitHub: [github.com/sabnira](https://github.com/sabnira)
- LinkedIn: [linkedin.com/in/sabnira-afrin](https://linkedin.com/in/sabnira-afrin)

---

⭐ If you like this project, please give it a star on GitHub!