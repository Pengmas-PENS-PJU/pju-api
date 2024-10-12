const jwt = require('jsonwebtoken');
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is required' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token must be type Bearer' });
    }

    const refreshToken = authHeader.split(' ')[1];

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const refreshTokenDB = await prisma.refreshToken.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!refreshTokenDB) {
      return res.status(403).json({ message: 'Refresh token not found in database' });
    }

    const decoded = jwt.verify(refreshToken, refreshTokenSecretKey);

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = refreshTokenMiddleware;
