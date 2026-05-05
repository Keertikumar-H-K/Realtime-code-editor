# CodeSync – Real-Time Code Collaboration Platform

## Project Overview

**Project Name:** CodeSync  
**Type:** Full-stack Web Application  
**Core Functionality:** Real-time collaborative code editing platform where multiple users can simultaneously edit code in shared rooms with live synchronization, chat, and code execution capabilities.  
**Target Users:** Developers, students, coding bootcamps, interview candidates, pair programmers

---

## Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth (Email/Password + Phone OTP)
- **Real-time:** Socket.io-client
- **Code Editor:** Monaco Editor (@monaco-editor/react)
- **Routing:** React Router v6
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time:** Socket.io
- **Database:** In-memory store (for simplicity) with MongoDB-ready structure

---

## UI/UX Specification

### Color Palette

#### Light Mode
- **Background Primary:** `#F8FAFC` (slate-50)
- **Background Secondary:** `#FFFFFF` (white)
- **Background Tertiary:** `#F1F5F9` (slate-100)
- **Text Primary:** `#0F172A` (slate-900)
- **Text Secondary:** `#475569` (slate-600)
- **Accent Primary:** `#6366F1` (indigo-500)
- **Accent Hover:** `#4F46E5` (indigo-600)
- **Success:** `#10B981` (emerald-500)
- **Error:** `#EF4444` (red-500)
- **Border:** `#E2E8F0` (slate-200)

#### Dark Mode
- **Background Primary:** `#0F172A` (slate-900)
- **Background Secondary:** `#1E293B` (slate-800)
- **Background Tertiary:** `#334155` (slate-700)
- **Text Primary:** `#F8FAFC` (slate-50)
- **Text Secondary:** `#94A3B8` (slate-400)
- **Accent Primary:** `#818CF8` (indigo-400)
- **Accent Hover:** `#6366F1` (indigo-500)
- **Success:** `#34D399` (emerald-400)
- **Error:** `#F87171` (red-400)
- **Border:** `#475569` (slate-600)

### Typography
- **Font Family:** `'Inter', 'Segoe UI', system-ui, sans-serif`
- **Monospace:** `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`
- **Heading 1:** 2.5rem (40px), font-weight: 700
- **Heading 2:** 2rem (32px), font-weight: 600
- **Heading 3:** 1.5rem (24px), font-weight: 600
- **Body:** 1rem (16px), font-weight: 400
- **Small:** 0.875rem (14px), font-weight: 400

### Spacing System
- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96px

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Layout Structure

#### Login/Signup Pages
- Centered card layout (max-width: 400px)
- Logo at top
- Form fields with labels
- Social login buttons (Google, GitHub)
- Toggle between login/signup

#### Dashboard Page
- Header with logo, user avatar, logout button
- Main content: Two columns on desktop, stacked on mobile
- Left: Create room section
- Right: Join room section
- Recent rooms list below

#### Editor Page
- Header: Room info, active users, language selector, run button, theme toggle
- Left sidebar (collapsible): Room chat
- Main area: Monaco Editor (full height)
- Bottom panel (collapsible): Output/Console

---

## Component Specifications

### 1. AuthContext
- Manages user authentication state
- Provides: `user`, `loading`, `login`, `signup`, `logout`, `loginWithPhone`
- Uses Firebase Auth

### 2. ThemeContext
- Manages dark/light mode
- Persists to localStorage
- Provides: `theme`, `toggleTheme`

### 3. SocketContext
- Manages Socket.io connection
- Provides: `socket`, `connected`, `joinRoom`, `leaveRoom`, `emitEvent`

### 4. ProtectedRoute Component
- Redirects to `/login` if user not authenticated
- Shows loading spinner while checking auth

### 5. Room Components
- `CreateRoom`: Form to generate unique room ID
- `JoinRoom`: Input field for room ID or link
- `RoomHeader`: Shows room name, users, actions

### 6. Editor Components
- `CodeEditor`: Monaco Editor wrapper
- `LanguageSelector`: Dropdown for language selection
- `OutputPanel`: Shows code execution results

### 7. Chat Components
- `ChatPanel`: Real-time chat interface
- `MessageList`: Scrollable message list
- `MessageInput`: Input with send button

---

## Functionality Specification

### Authentication Flow
1. **Email/Password Signup:**
   - User enters email, password, confirm password
   - Firebase creates user account
   - Redirect to dashboard

2. **Email/Password Login:**
   - User enters email, password
   - Firebase authenticates
   - Redirect to dashboard

3. **Phone OTP Login:**
   - User enters phone number
   - Firebase sends OTP
   - User enters OTP
   - Redirect to dashboard

4. **Session Persistence:**
   - Use Firebase `onAuthStateChanged`
   - Store user in React Context
   - Auto-redirect on session expiry

### Room System
1. **Create Room:**
   - Generate unique 8-character room ID (alphanumeric)
   - Store room in backend with creator as admin
   - Redirect to `/room/:roomId`

2. **Join Room:**
   - Enter room ID or click shared link
   - Validate room exists
   - Add user to room's user list
   - Sync current code state

3. **Leave Room:**
   - Emit `leave-room` event
   - Remove from room's user list
   - Redirect to dashboard

### Real-Time Code Sync
1. **Code Change Event:**
   - User types in editor
   - Emit `code-change` with: `{ roomId, code, language }`
   - Server broadcasts to all room users (except sender)

2. **Cursor Position:**
   - Emit `cursor-position` with: `{ roomId, userId, position }`
   - Show colored cursor for each user

3. **User Presence:**
   - Emit `user-joined` when user enters room
   - Emit `user-left` when user leaves
   - Update active users list in real-time

### Chat System
1. **Send Message:**
   - User types message and sends
   - Emit `chat-message` with: `{ roomId, userId, userName, message, timestamp }`
   - Server broadcasts to room

2. **Message Display:**
   - Show username, message, timestamp
   - Different style for own messages
   - Auto-scroll to latest

### Code Execution
1. **Supported Languages:** JavaScript, Python, C++
2. **Execution Flow:**
   - User clicks "Run" button
   - Send code to execution API (Piston API - free)
   - Display output in output panel
   - Show errors if any

---

## API Endpoints

### Backend Routes
```
POST /api/auth/register - Register user (optional, Firebase handles auth)
GET  /api/rooms/:roomId - Get room details
POST /api/rooms - Create new room
DELETE /api/rooms/:roomId - Delete room (admin only)
```

### Socket Events
```
Client → Server:
- join-room { roomId, userId, userName }
- leave-room { roomId, userId }
- code-change { roomId, code, language }
- cursor-position { roomId, userId, position }
- chat-message { roomId, userId, userName, message }

Server → Client:
- user-joined { userId, userName }
- user-left { userId }
- code-update { code, language }
- cursor-update { userId, position }
- chat-broadcast { userId, userName, message, timestamp }
- room-users { users[] }
```

---

## Page Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Landing (redirect to dashboard or login) | Public |
| `/login` | LoginPage | Public |
| `/signup` | SignupPage | Public |
| `/dashboard` | Dashboard | Protected |
| `/room/:roomId` | EditorPage | Protected |

---

## File Structure

```
realtime-code-editor/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── SignupForm.jsx
│   │   │   ├── Editor/
│   │   │   │   ├── CodeEditor.jsx
│   │   │   │   ├── LanguageSelector.jsx
│   │   │   │   └── OutputPanel.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Room/
│   │   │   │   ├── CreateRoom.jsx
│   │   │   │   ├── JoinRoom.jsx
│   │   │   │   └── RoomHeader.jsx
│   │   │   └── Chat/
│   │   │       ├── ChatPanel.jsx
│   │   │       └── MessageList.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Editor.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── index.js
│   │   ├── socket/
│   │   │   └── socketHandler.js
│   │   └── routes/
│   │       └── rooms.js
│   ├── .env
│   └── package.json
│
├── SPEC.md
└── README.md
```

---

## Environment Variables

### Client (.env)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SOCKET_URL=http://localhost:3001
```

### Server (.env)
```
PORT=3001
CLIENT_URL=http://localhost:5173
```

---

## Acceptance Criteria

### Authentication
- [ ] User can sign up with email/password
- [ ] User can log in with email/password
- [ ] User can log in with phone OTP
- [ ] Protected routes redirect to login when not authenticated
- [ ] User can log out

### Room System
- [ ] User can create a new room with unique ID
- [ ] User can join existing room by ID
- [ ] User can copy room link to clipboard
- [ ] User can see active users in room

### Code Editor
- [ ] Monaco Editor loads correctly
- [ ] Syntax highlighting works for JS, Python, C++
- [ ] Language can be changed via dropdown
- [ ] Code changes sync in real-time to other users

### Chat
- [ ] User can send messages in room
- [ ] Messages appear in real-time for all users
- [ ] Messages show username and timestamp

### UI/UX
- [ ] Dark/light mode toggle works
- [ ] UI is responsive on mobile and desktop
- [ ] All buttons and interactions work smoothly

### Code Execution
- [ ] JavaScript code can be executed
- [ ] Python code can be executed
- [ ] Output displays in output panel

---

## External APIs

### Firebase Authentication
- Documentation: https://firebase.google.com/docs/auth
- Used for: Email/password, phone OTP, Google auth

### Piston API (Code Execution)
- Base URL: `https://emkc.org/api/v2/piston`
- Endpoints:
  - `GET /runtimes` - List supported languages
  - `POST /execute` - Execute code
- Free tier: Unlimited requests
- Supported languages: JavaScript, Python, C++, and many more