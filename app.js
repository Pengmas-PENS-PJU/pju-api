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

// config
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

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

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/sensor", sensorRouter);

// // view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// app.use(express.static(path.join(__dirname, "public")));

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

// buat server HTTP
const server = http.createServer(app);

// buat server Socket.IO
initSocket(server);

server.listen(port, () => {
  console.log(`Server berjalan diPORT ${port}`);
});

module.exports = { server };
