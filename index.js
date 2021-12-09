const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = app.listen("3001", () => {
  console.log("Server Running On Port 3001...");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data.roomId);
    console.log("User joined Room : " + JSON.stringify(data));
    socket.to(data.roomId).emit("user_joined_room", data);
  });

  socket.on("send_msg", (data) => {
    console.log(data);
    socket.to(data.room).emit("recieve_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});
