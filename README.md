# Transcendence

## Overview
**Transcendence**, a web-based multiplayer Pong game designed for real-time competition! This project provides an engaging user interface and seamless gameplay for you and your friends. The website offers various modules and features that enhance the traditional Pong experience.

## Features
### Core Features
- **Single-Page Application (SPA)** with smooth navigation.
- **Multiplayer Pong** gameplay with matchmaking.
- **Tournament Mode** for competitive play.
- **User Registration** system for managing player aliases.
- **Keyboard-based Controls** for an authentic Pong experience.
- **Security Compliance**, including password hashing, HTTPS, and input validation.
- **Dockerized Deployment** for easy setup and scalability.

### Additional Modules
#### Major Modules
- **Backend Framework (Django + PostgreSQL):**
  - The backend is built with Django, ensuring a scalable and maintainable server architecture.
  - PostgreSQL serves as the primary database, handling user and game data.
- **Remote Players:**
  - Players can compete online from different devices.
  - Handles network stability, latency, and disconnection scenarios.
- **Multiple Players Mode:**
  - Expands gameplay beyond 2 players.
  - Introduces new game dynamics for larger matches.
- **Microservices-Based Backend:**
  - The backend is structured as microservices, enabling independent deployment and scaling.
  - API-driven architecture with RESTful endpoints.
- **CLI Pong Against Web Players:**
  - A command-line interface (CLI) allows users to play against web-based opponents.
  - Real-time synchronization between CLI and web players through API integration.

#### Minor Modules
- **Frontend Framework (Bootstrap + JavaScript + CSS):**
  - The frontend is built with JavaScript for interactivity.
  - Bootstrap provides a UI.
  - CSS is used for additional styling and customization.
- **SQLite Database Support:**
  - SQLite is used for lightweight and consistent data management.
- **Expanded Browser Compatibility:**
  - Additional support for various web browsers beyond Mozilla Firefox.

## Technical Requirements
- **Frontend:** JavaScript, CSS, and Bootstrap.
- **Backend:** Django + PostgreSQL.
- **Database:** PostgreSQL (default) or SQLite.
- **Deployment:** Uses Docker for containerization.
- **Security:** Password hashing and protection against SQL Injection/XSS.

## Installation & Setup
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/adjmel/ft_transcendence.git transcendence
   cd transcendence
   ```
2. **Set Up Environment Variables:**
   - Create a `.env` file and configure credentials (database, API keys, etc.).
3. **Build & Run Using Docker:**
   ```sh
   docker-compose up --build
   ```
4. **Access the Web App:**
   - Open your browser and navigate to `http://localhost:8000`

## Contributors
https://github.com/ivanna-tchinda
https://github.com/AliAlkhiro
https://github.com/afelten
https://github.com/algeorge