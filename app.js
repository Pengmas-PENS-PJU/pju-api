var express = require("express");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const router = require("./routes/index.js");
const { initSocket } = require("./socket");
const seeder = require("./prisma/seed.js");

// config
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

//  run seeder
await seeder();

// alamat diizinkan cors
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN.split(","),
  })
);

// package
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// path router
app.use(router);

// buat server HTTP
const server = http.createServer(app);

// buat server Socket.IO
initSocket(server);

server.listen(port, () => {
  console.log(`Server berjalan diPORT ${port}`);
});

module.exports = { server };
