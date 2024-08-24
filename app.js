var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const router = require('./routes/index.js');
const { initSocket } = require('./socket');
const seeder = require('./prisma/seed.js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// config
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

//  run seeder
// seeder;

// Swagger API Docs Setup Start
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Smart PJU Monitoring API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://pju-api-hveq5uky7q-et.a.run.app',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/**/*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// Swagger API Docs Setup End

// alamat diizinkan cors
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN.split(','),
  })
);

// package
app.use(logger('dev'));
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
