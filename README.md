# 🎲 Monopoly - Fullstack Frontend

This is the frontend of a fullstack Monopoly game built using **React** and **Vite**. It provides a fast, interactive, and visually engaging experience for players, connecting to a backend API to support real-time gameplay, user authentication, and dynamic board interactions.

---

##  Tech Stack

- **React** – UI library for building interactive components
- **Vite** – Lightning-fast build tool with HMR
- **JavaScript** – Core language for logic and interactivity
- **CSS** – Styling and layout
- **React Router** – Client-side routing
- **Axios** – API communication
- **ESLint** – Code linting and quality enforcement

---

##  Project Structure

├── public/ # Static assets ├── src/ │ ├── assets/ # Images and icons │ ├── components/ # Reusable UI components │ ├── pages/ # Route-based views │ ├── services/ # API calls and endpoints │ ├── utils/ # Helper functions │ ├── App.jsx # Root component │ └── main.jsx # Entry point ├── .eslintrc.cjs # ESLint configuration ├── vite.config.js # Vite build settings ├── package.json # Dependencies and scripts └── README.md # Project documentation


---

##  Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/Monopoly-_-Fullstack-Frontend.git
cd Monopoly-_-Fullstack-Frontend
npm install
```

  

### API Integration
The frontend communicates with a backend API for:

User authentication (/auth/login, /auth/register)

Game state (/game/start, /game/state, /game/action)

Chat functionality (/chat/send, /chat/history)

Configure the base URL in src/services/api.js.


 ### License
 This project was done by Brenda, Jusin and Roy.