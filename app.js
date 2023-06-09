const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  roomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

// Set static path

app.use(express.static(path.join(__dirname, "public")));

// Run when client connects

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));

    // BroadCast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: roomUsers(user.room),
    });
  });

  // Listen to chat message
  socket.on("chatMessage", (msg) => {
    let user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // when client disconnect
  socket.on("disconnect", () => {
    let user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: roomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
