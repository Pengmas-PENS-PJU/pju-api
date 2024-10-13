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
const crypto = require("crypto");
const key = require("./services/key.js");
// const seeder = require("./prisma/seed.js");
// const { startDeleteScheduler } = require("./job/job.js");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middleware/errorHandler.js");

// config
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// generate api key
key.generateKey();

// start scheduler
// startDeleteScheduler();

// Swagger API Docs Setup Start
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Smart PJU Monitoring API Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://pju-api-production.up.railway.app",
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key to authorize requests",
        },
        AccessTokenAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Access Token to authorize requests",
        },
        RefreshTokenAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Refresh Token to authorize requests",
        },
      },
    },
  },
  apis: ["./routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  express.static("node_modules/swagger-ui-dist/", { index: false }),
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
// Swagger API Docs Setup End

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

app.use(errorHandler);

// buat server HTTP
const server = http.createServer(app);

// buat server Socket.IO
initSocket(server);

server.listen(port, () => {
  console.log(`Server berjalan diPORT ${port}`);
});

module.exports = { server };
