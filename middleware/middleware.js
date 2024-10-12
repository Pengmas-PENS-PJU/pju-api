const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const { decrypt, getKey } = require('../services/key.js');
const { verifyCookie } = require('../services/jwt.js');

// USER auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is required' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token must be type Bearer' });
  }
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  const { loggedIn, _ } = verifyCookie(token);

  if (!loggedIn) {
    return res.status(403).json({ message: 'Invalid token' });
  } else {
    next();
  }
};

// validate api key
const validateKey = async (req, res, next) => {
  const keyFromClient = req.headers['x-api-key'];

  if (!keyFromClient) {
    return res.status(401).json({ message: 'API key is required' });
  }

  const apiKey = await getKey();
  console.log('API key from client:', keyFromClient);
  console.log('API key from database:', apiKey);

  if (!apiKey) {
    return res.status(404).json({ message: 'API key not found' });
  }

  if (keyFromClient !== decrypt(apiKey)) {
    return res.status(403).json({ message: 'Invalid API key' });
  }

  next();
};

exports.authenticateToken = authenticateToken;
exports.validateKey = validateKey;
