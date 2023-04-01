const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

// Set static path

app.use(express.static(path.join(__dirname, "public")));

// Run when client connects

io.on("connection", (socket) => {

  // welcome current user  
  socket.emit('message',formatMessage(botName,'Welcome to ChatCord'));

  // BroadCast when a user connects
  socket.broadcast.emit('message',formatMessage(botName,'A user has joined the chat'));

  // when client disconnect
  socket.on('disconnect',()=>{
    io.emit('message',formatMessage(botName,'A user has left the chat'));
  })

  // Listen to chat message
  socket.on('chatMessage',(msg)=>{
    io.emit('message',formatMessage('USER',msg))
  })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
