const http = require("http");
const server = http.createServer();
require("dotenv").config();
const PORT = process.env.PORT || 9000;

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
  },
});
const users = {};

// console.log("yes");

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    if (name !== null) {
      console.log(name);
      users[socket.id] = name;
      socket.broadcast.emit("user-joined", name);
    }
  });

  socket.on("send", (data) => {
    socket.broadcast.emit("receive", {
      message: data,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id] !== null) {
      socket.broadcast.emit("left", users[socket.id]);
    }
  });
});

server.listen(PORT);
