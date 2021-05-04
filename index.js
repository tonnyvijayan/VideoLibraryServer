require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { intializeDbconnection } = require("./db/db.connection");
const routeNotFound = require("./middlewares/route.not.found");
const errorHandler = require("./middlewares/errorHandler");

intializeDbconnection();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world and what else nice");
  //   res.json({ success: true });
});

const users = require("./routes/user.router");
const playlist = require("./routes/playlist.router");
const videos = require("./routes/video.router");

app.use("/users", users);
app.use("/videos", videos);
app.use("/playlists", playlist);

app.use(routeNotFound);
app.use(errorHandler);
let port = 3010;

app.listen(process.env.PORT || port, () => {
  console.log("server listening on port", port);
});
