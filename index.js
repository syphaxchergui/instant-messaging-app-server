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

var sockets = [];

io.on("connection", (socket) => {
  const id = socket.id;

  socket.on("join_room", (data) => {
    socket.join(data.roomId);
    sockets[id] = data;
    console.log("User joined Room : " + JSON.stringify(data));
    socket.to(data.roomId).emit("user_joined_room", data);
  });

  socket.on("send_msg", (data) => {
    console.log(data);
    socket.to(data.room).emit("recieve_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED ");
    console.log(sockets[id].roomId);
    //socket.to(socket[id].roomId).emit("user_unjoined_room", socket[id]);
  });
});
