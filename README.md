# 🎲 Monopoly Fullstack Frontend

This is the **frontend** for the Monopoly Fullstack project — an interactive digital remake of the classic Monopoly board game.  
It provides the user interface that connects with the Flask backend, allowing players to roll dice, move around the board, buy properties, pay rent, draw Chance/Community Chest cards, and manage game states in real-time.

---

##  Overview

The Monopoly frontend is built using **React** and **Vite**, delivering a fast, dynamic, and responsive UI. It integrates with the backend via RESTful APIs to handle all game logic, player management, and property transactions.  

The goal is to recreate the Monopoly experience digitally while maintaining the rules and flow of the traditional board game.

---

## 🚀 Features

- 🎮 **Interactive Gameplay:** Real-time updates for moves, property purchases, and player turns.  
- 👥 **Multiplayer Support:** Multiple players can join the same game session.  
- 🧩 **Dynamic Board Rendering:** Each tile reflects its current state — owned, mortgaged, or free.  
- 💰 **Property Management:** Players can buy, rent, or sell properties during the game.  
- 🏦 **Bank & Balance Tracking:** Displays real-time balances for each player.  
- 🏛️ **Special Tiles Logic:** Includes Go, Jail, Free Parking, Chance, and Community Chest.  
- 📱 **Responsive Design:** Works across desktop and tablet screen sizes.  
- 🔗 **Backend Integration:** Communicates seamlessly with the Flask API for state persistence.  

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | React (Vite) |
| Language | JavaScript (ES6+) |
| State Management | React Hooks / Context API |
| Styling | CSS / Tailwind |
| Backend | Flask (Python) |
| API Handling | Fetch / Axios |
| Authentication | Supabase |
| Version Control | Git + GitHub |

---

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Monopoly-_-Fullstack-Frontend.git
cd Monopoly-_-Fullstack-Frontend
2. Install Dependencies
bash
Copy code
npm install
3. Set Up Environment Variables
Create a .env file in the project root with:

ini
Copy code
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000

 Note:

Replace VITE_API_BASE_URL with your Flask backend URL.

You can use a deployed backend for production mode.

4. Start the Development Server
bash
Copy code
npm run dev
Open your browser and navigate to:

arduino
Copy code
http://localhost:5173
🗂 Folder Structure
php
Copy code
monopoly-frontend/
│
├── public/                 # Public assets (favicon, images, etc.)
├── src/
│   ├── assets/             # Game-related images and icons
│   ├── components/         # Game Logic
│   ├── pages/              # Page-level components (Landing page, Login, Register)
│   ├── services/api.js     # Api handling
│   ├── supabaseClient.js   # Supabase setup
│   ├── App.jsx             # Main app entry
│   ├── main.jsx            # React DOM rendering
│   └── index.css           # Global styling
│
├── .gitignore
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md

 Key Components**

 App.jsx:
Handles routing, game state management, and board display. It acts as the central control for the Monopoly UI.

 components/
Handle the game logic(Property,jail,Rent e.t.c)

 supabaseClient.js
Initializes and configures Supabase for authentication and user sessions.


 Development Notes**
Ensure your Flask backend is running before starting the frontend.


 Contributors**
Brenda Njaramba, Justine Gichure and Roy Moen

and the Monopoly project team (UI & gameplay integration).

