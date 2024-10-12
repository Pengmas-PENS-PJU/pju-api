const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const secretKey = process.env.SECRET_KEY;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
const prisma = require('../configs/prisma');

// create session
const createAccessToken = (userId, username, name, email, roleCode) => {
  if (userId === undefined || roleCode === undefined) {
    throw new Error('userId and role_code must be specified');
  }

  try {
    const accessToken = jwt.sign({ user_id: userId, username: username, name: name, email: email, role: roleCode }, secretKey, { expiresIn: '1h' });

    return accessToken;
  } catch (error) {
    console.error('Cannot create user session', error.message);
    throw new Error('Cannot create user session', error.message);
  }
};

const createRefreshToken = (userId, username, name, email, roleCode) => {
  if (userId === undefined || roleCode === undefined) {
    throw new Error('userId and role_code must be specified');
  }

  try {
    const refreshToken = jwt.sign({ user_id: userId, username: username, name: name, email: email, role: roleCode }, refreshTokenSecretKey, { expiresIn: '7d' });

    return refreshToken;
  } catch (error) {
    console.error('Cannot create user session', error.message);
    throw new Error('Cannot create user session', error.message);
  }
};

const refreshAccessToken = async (refreshToken) => {
  if (refreshToken === undefined) {
    throw new Error('refreshToken must be specified');
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecretKey);

    user_id = decoded.user_id;
    username = decoded.username;
    name = decoded.name;
    email = decoded.email;
    role_code = decoded.role;

    const accessToken = createAccessToken(user_id, username, name, email, role_code);

    await prisma.refreshToken.update({
      where: {
        refresh_token: refreshToken,
      },
      data: {
        access_token: accessToken,
      },
    });

    return accessToken;
  } catch (error) {
    console.error('Cannot refresh user token', error.message);
    throw new CustomError(error.message, 500);
  }
};

// decrypt session
const verifyCookie = (token) => {
  if (token === undefined) {
    throw new Error('token must be specified');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return {
      loggedIn: true,
      result: decoded,
    };
  } catch (error) {
    console.log(error.message);
    return {
      loggedIn: false,
      result: null,
    };
  }
};

const getDataUser = (req) => {
  const header = req.headers['authorization'];

  try {
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;

    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Cannot decode user session', error.message);
    throw new Error('Cannot decode user session', error.message);
  }

  return null;
};

exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;
exports.verifyCookie = verifyCookie;
exports.getDataUser = getDataUser;
exports.refreshAccessToken = refreshAccessToken;
