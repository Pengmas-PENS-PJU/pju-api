const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { generateKey } = require('../services/key.js');
const { createAccessToken, createRefreshToken, getDataUser, refreshAccessToken } = require('../services/jwt.js');
const { insertUser, getUserById, getUserByEmail, getAllUsers, updateUserById, deleteUserById } = require('../services/user.js');

const secretKey = process.env.SECRET_KEY;

// register user admin
exports.RegisterUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'User registered successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login user admin
exports.LoginUser = async (req, res) => {
  const { username_email, password } = req.body;
  console.log('username_email', username_email);
  console.log('password', password);

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: username_email,
          },
          {
            username: username_email,
          },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: `User with username or email ${username_email} not registered.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    const accessToken = createAccessToken(user.id, user.username, user.name, user.email, user.role_code);
    const refreshToken = createRefreshToken(user.id, user.username, user.name, user.email, user.role_code);

    await prisma.refreshToken.create({
      data: {
        refresh_token: refreshToken,
        access_token: accessToken,
        user_id: user.id,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    const responseBody = {
      message: 'Logged in successfully',
      data: {
        user: userWithoutPassword,
        token: {
          access_token: accessToken,
          refresh_token: refreshToken,
          type: 'Bearer',
        },
      },
    };

    res.json(responseBody);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.LogoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(' ')[1];

    const refreshTokenDB = await prisma.refreshToken.findFirst({
      where: {
        access_token: accessToken,
      },
    });

    if (!refreshTokenDB) {
      return res.status(403).json({ message: 'Refresh Token with the given Access Token not found in database' });
    }

    await prisma.refreshToken.delete({
      where: {
        access_token: accessToken,
      },
    });

    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.GetCurrentUser = async (req, res) => {
  const token = req.headers.authorization;

  // decode token

  try {
    const decoded = jwt.verify(token, secretKey);

    const data = {
      message: 'Logged in user found',
      data: {
        id: decoded.user_id,
        username: decoded.username,
        name: decoded.name,
        email: decoded.email,
        role_code: decoded.role,
      },
    };

    res.json(data);
  } catch (error) {
    const data = {
      error: error.message,
    };

    res.status(500).json(data);
  }
};

exports.RefreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const refreshToken = authHeader.split(' ')[1];

    const accessToken = refreshAccessToken(refreshToken);

    res.json({
      message: 'Access token refreshed successfully',
      data: {
        access_token: accessToken,
        type: 'Bearer',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApiKey = async (req, res) => {
  try {
    const apiKey = await generateKey();

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil api key',
      data: {
        apiKey: apiKey,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data',
      error: error.message,
    });
  }
};

exports.GetAllUser = async (req, res) => {};

exports.GetUser = async (req, res) => {
  const user_id = parseInt(req.params.userId, 10);
  const dataUser = getDataUser(req);

  if (user_id == null) {
    return res.status(403).json({
      success: false,
      message: 'user_id not specified',
      data: dataUser,
    });
  }

  try {
    if (dataUser.role != 'ADMIN' && user_id != dataUser.user_id) {
      return res.status(400).json({
        success: false,
        message: 'You dont have permission to access this user',
        data: {},
      });
    }

    const result = await getUserById(user_id);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data',
      data: result,
    });
  } catch (error) {
    console.error('Error getting data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data',
      error: error.message,
      data: {},
    });
  }
};

exports.UpdateUser = async (req, res) => {};

exports.DeleteUser = async (req, res) => {};
