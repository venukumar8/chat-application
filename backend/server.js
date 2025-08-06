require('dotenv').config({path:"../.env"});
const path = require("path");
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const users = {}; // track socket users

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('join', ({ username }) => {
    users[socket.id] = username;
    socket.broadcast.emit('user-joined', username);
  });

  socket.on('private-message', async ({ to, message }) => {
    const newMessage = new Message({ sender: users[socket.id], receiver: to, text: message });
    await newMessage.save();
    io.emit('private-message', { from: users[socket.id], to, message });
  });

  socket.on('group-message', async ({ group, message }) => {
    const newMessage = new Message({ sender: users[socket.id], group, text: message });
    await newMessage.save();
    io.emit('group-message', { from: users[socket.id], group, message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', users[socket.id]);
    delete users[socket.id];
  });
});
app.use(express.static(path.join(__dirname, "../frontend")));

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
const mongoose = require('mongoose');

connectDB();