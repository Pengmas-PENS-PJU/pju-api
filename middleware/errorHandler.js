const CustomError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500; // Default status code 500 jika tidak ada
  let message = err.message || "Internal Server Error";

  // Kirim respons JSON dengan status code dan pesan
  res.status(statusCode).json({
    success: false,
    message: message,
    data: null,
    error_details: null,
  });
};

module.exports = errorHandler;
