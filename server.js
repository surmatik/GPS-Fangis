const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("device_id", (deviceID) => {
    console.log(`Device connected: ${deviceID}`);

    socket.on("location", (location) => {
      console.log(`Device ${deviceID} is at ${location.lat}, ${location.lon}`);

      io.emit("update", { id: deviceID, location: location });
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
