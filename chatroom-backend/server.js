require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chatroom backend is running');
});

app.get('/messages/:roomID', async (req, res) => {
  const roomID = req.params.roomID;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomID)
    .order('created_at', { ascending: true })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on('join_room', (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room ${roomID}`);
  });

  socket.on('send_message', async ({ roomID, message, sender }) => {
    const { data, error } = await supabase.from('messages').insert([
      {
        room_id: roomID,
        sender: sender,
        message: message,
      },
    ]);

    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
      return;
    }

    io.to(roomID).emit('receive_message', {
      roomID,
      sender: sender,
      message,
      created_at: new Date().toISOString(),
    });

    console.log(`💬 Message from ${sender} sent in room ${roomID}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY);
