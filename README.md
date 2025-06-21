# Textre Chatroom

A minimalist real-time chatroom app built with **Next.js**, **Socket.IO**, and **Supabase**. Users can join a chat by entering a room ID—no authentication required.

---

##  Features

-  Real-time messaging with Socket.IO
-  Room-based chat (only users in same room can chat)
-  Persistent chat history stored in Supabase
-  Auto-deletes messages older than 5 days
-  Styled with Tailwind CSS + ShadCN components
-  Light/Dark mode with toggle

---

##  Tech Stack

| Tech        | Purpose                          |
|-------------|----------------------------------|
| Next.js     | Frontend framework               |
| Socket.IO   | Real-time messaging              |
| Supabase    | Backend-as-a-Service (Postgres)  |
| Node.js     | Express backend server           |
| TailwindCSS | Styling                          |

---

##  Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/textre-chat.git
cd textre-chat
```

### 2. Setup the backend

- Navigate to `chatroom-backend/`
- Create a `.env` file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=5000
```

- Install backend dependencies:
```bash
npm install
```

- Start the backend:
```bash
npm run start
```

### 3. Setup the frontend

- Navigate to `textre-chat/` (your Next.js frontend)
- Install frontend dependencies:
```bash
npm install
```

- Start the frontend:
```bash
npm run dev
```

## 💬 Message Flow

1. User joins a room by ID
2. Sends a message → sent to backend via Socket.IO
3. Backend stores message in Supabase DB
4. All users in that room receive message in real-time
5. On reload, latest 25 messages are fetched via REST



##  Auto-Cleanup Policy

- Messages older than **5 days** are deleted using:
- Run manually in Supabase SQL Editor or schedule with a CRON job

---

##  Folder Structure

```
textre-chat/
├── chatroom-backend/     # Node.js + Socket.IO backend
├── chatroom-frontend/    # Next.js frontend
└── .env                  # Env file for Supabase keys
```

##  License

[GNU Affero General Public License v3.0](https://github.com/lhcee3/Textre/blob/main/LICENSE)

