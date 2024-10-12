const jwt = require('jsonwebtoken'); // Pastikan untuk mengimpor jwt
const { accessTokenSecretKey } = require('../configs/keys');
const CustomError = require('../utils/customError'); // Pastikan untuk mengimpor CustomError

const roleMiddleware = (roleCode) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(accessToken, accessTokenSecretKey);

      if (decoded.role === roleCode) {
        return next();
      } else {
        throw new CustomError('Unauthorized access', 401);
      }
    } catch (error) {
      throw new CustomError('Invalid access token', 401);
    }
  };
};

module.exports = roleMiddleware;
