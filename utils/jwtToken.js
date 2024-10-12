const jwt = require('jsonwebtoken');
const { accessTokenSecretKey, refreshTokenSecretKey } = require('../configs/keys');

const decodJwtToken = (token, tokenName = 'access') => {
  let secretKey = tokenName === 'access' ? accessTokenSecretKey : refreshTokenSecretKey;

  return jwt.verify(token, secretKey);
};

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};

module.exports = { decodJwtToken, getTokenFromHeader };
