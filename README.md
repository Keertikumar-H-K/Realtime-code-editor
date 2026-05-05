# CodeSync – Real-Time Code Collaboration Platform

A production-level full-stack web application for real-time code collaboration. Multiple users can simultaneously edit code in shared rooms with live synchronization, chat, and code execution capabilities.

![CodeSync](https://img.shields.io/badge/CodeSync-v1.0.0-primary)

## ✨ Features

- **User Authentication**: Email/password login, phone OTP authentication via Firebase
- **Real-Time Collaboration**: Multiple users can edit code simultaneously with live sync
- **Monaco Editor**: VS Code's editor with syntax highlighting for multiple languages
- **Room System**: Create/join rooms with unique IDs, share via link
- **Built-in Chat**: Real-time chat within each room
- **Code Execution**: Run JavaScript, Python, C++ code directly in the browser
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Firebase Authentication
- Socket.io-client
- Monaco Editor

### Backend
- Node.js
- Express.js
- Socket.io

## 📁 Project Structure

```
realtime-code-editor/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── .env               # Environment variables
│   └── package.json
├── server/                 # Node backend
│   ├── src/
│   │   ├── socket/        # Socket.io handlers
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   ├── .env               # Environment variables
│   └── package.json
├── SPEC.md                 # Detailed specifications
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd realtime-code-editor

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication**:
   - Email/Password
   - Phone (for OTP login)
4. Go to **Project Settings** > **General** > **Your apps**
5. Copy the Firebase config values

### 3. Configure Environment Variables

#### Server (.env)
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

#### Client (.env)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SOCKET_URL=http://localhost:3001
```

### 4. Run the Application

#### Start the Backend Server
```bash
cd server
npm run dev
```
Server runs on http://localhost:3001

#### Start the Frontend
```bash
cd client
npm run dev
```
Client runs on http://localhost:5173

### 5. Open in Browser

Navigate to http://localhost:5173 and:
1. Sign up or log in
2. Create a new room or join an existing one
3. Start collaborating!

## 🔐 Authentication Flow

1. **Email/Password**: Traditional signup/login
2. **Phone OTP**: Enter phone number, receive verification code, log in
3. Sessions are managed by Firebase Auth
4. Protected routes redirect to login if not authenticated

## ⚡ Real-Time Logic

### Socket Events

| Event | Description |
|-------|-------------|
| `join-room` | User joins a room |
| `leave-room` | User leaves a room |
| `code-change` | Code editor content changes |
| `language-change` | Programming language changed |
| `cursor-position` | User cursor position (for future) |
| `chat-message` | New chat message |
| `typing` | User typing indicator |

### Room Management

- Rooms are stored in memory (can be extended to MongoDB)
- Each room maintains: users, code, language, chat history
- Empty rooms are cleaned up after 5 minutes

## 💻 Code Execution

Uses the [Piston API](https://github.com/engineer-man/piston) for code execution:

| Language | Version |
|----------|---------|
| JavaScript | 18.15.0 |
| Python | 3.10.0 |
| C++ | 10.2.0 |
| Java | 15.0.2 |
| Go | 1.16.2 |
| Rust | 1.68.2 |
| TypeScript | 5.0.3 |

## 🌐 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `PORT`: 3001
   - `CLIENT_URL`: Your Vercel frontend URL
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend (Vercel)

1. Import your GitHub repository to Vercel
2. Configure environment variables with your Firebase config
3. Set `VITE_SOCKET_URL` to your Render backend URL
4. Deploy!

## 🔧 API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/rooms/:roomId` | Get room details |
| POST | `/api/rooms` | Create new room |
| DELETE | `/api/rooms/:roomId` | Delete room |

### Socket.io Events

See [Real-Time Logic](#-real-time-logic) section above.

## 🎨 UI Pages

| Route | Description |
|-------|-------------|
| `/login` | Login page |
| `/signup` | Signup page |
| `/dashboard` | Create/join rooms |
| `/room/:roomId` | Code editor with chat |

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using React, Node.js, and Socket.io