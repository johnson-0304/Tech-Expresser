var express = require("express");
var app = express();
var path = require("path");
var router = require("./router.js");
var bodyParser = require("body-parser");
var session = require("express-session");
const formatMessage = require("./utils/message.js");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/chatUser.js");

const sockeio = require("socket.io");
const http = require("http");
const { Socket } = require("net");

const server = http.createServer(app);

const io = sockeio(server);

app.use("/public/", express.static(path.join(__dirname, "./public/")));
app.use(
  "/node_modules/",
  express.static(path.join(__dirname, "./node_modules/"))
);
app.use("/views/", express.static(path.join(__dirname, "./views/")));

app.engine("html", require("express-art-template"));
app.set("views", path.join(__dirname, "./views/"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "jj",
    resave: false,
    saveUninitialized: true,
  })
);

const botName = "Chat Bot";

//run when client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username }) => {
    const user = userJoin(socket.id, username);
    socket.join();
    console.log(user.username + " connected");

    //welcome
    socket.emit("message", formatMessage(botName, "Welcome to the chat !"));
    //user connect braodcast
    socket.broadcast.emit(
      "message",
      formatMessage(botName, `${user.username} has joined the chat`)
    );

    //send users and room info
    io.emit("roomUsers", {
      users: getRoomUsers(),
    });
  });

  //listen chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, msg));
  });

  // socket.on("chatMessage", (msg) => {
  //   const user = getCurrentUser(socket.id);

  //   io.to(user.room).emit("message", formatMessage(user.username, msg));
  // });

  //disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
    }
    io.emit("roomUsers", {
      users: getRoomUsers(),
    });
  });
});

app.use(router);

// app.listen(5000, function () {
//   console.log("running on port 5000");
// });

server.listen(5000, function () {
  console.log("running on port 5000");
});
