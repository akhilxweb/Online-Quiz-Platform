# QuizVerse | Futuristic AI Quiz Battle Platform

Compete. Learn. Dominate. The future of AI-powered competitive learning.

## 📁 Project Structure
- `/index.html`: Stunning landing page
- `/pages/`: App screens (Dashboard, Arena, Battle, Profile, etc.)
- `/css/`: Modular styling system (Glassmorphism, Neon Glow)
- `/js/`: Functional logic (Auth, Engine, Multiplayer, AI)

## 🛠️ Critical Setup Instructions

### 1. Firebase Integration (Mandatory for Login)
If login is not working, ensure you have followed these steps:
1.  **Project Setup**: Create a project at [Firebase Console](https://console.firebase.google.com/).
2.  **Enable Auth**: Go to `Build > Authentication > Get Started`. Enable **Email/Password** and **Google**.
3.  **Enable Database**: Go to `Build > Realtime Database`. Create a database in your preferred region. Set rules to:
    ```json
    {
      "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
    ```
4.  **Add Config**: Copy the `firebaseConfig` object into `js/firebase-config.js`.
5.  **Local Hosting**: Firebase Auth (especially Google Popup) often fails when opening HTML files directly via `file://`. **You MUST use a local server**. 
    *   **VS Code**: Install "Live Server" extension.
    *   **Node**: Run `npx serve .`

### 2. Groq AI Integration
1.  Get an API key from [Groq Cloud](https://console.groq.com/).
2.  Add it to the `GROQ_API_KEY` constant in `js/ai-generator.js`.

## 🚀 Key Features
- **AI Quiz Architect**: Generate custom quizzes on any topic using Groq API.
- **Real-time Battle Arena**: Synchronized multiplayer battles with live leaderboards.
- **Premium UI/UX**: Glassmorphism, neon effects, and cinematic animations.
- **Mastery Analytics**: Deep-dive performance insights with Chart.js.
- **Gamification**: XP, levels, badges, and streaks.

---
Built for the **ByteXL Hackathon**.
