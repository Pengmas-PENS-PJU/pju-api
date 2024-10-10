const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { generateKey } = require("../services/key.js");
const { createCookie, getDataUser } = require("../services/jwt.js");
const {
  insertUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUserById,
  deleteUserById,
} = require("../services/user.js");

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
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login user admin
exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createCookie(user.id, user.name, user.email, user.role);

    const { password: _, ...userWithoutPassword } = user;

    const responseBody = {
      message: "Logged in successfully",
      data: {
        user: userWithoutPassword,
        token: token,
      },
    };

    res.json(responseBody);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.GetCurrentUser = async (req, res) => {
  const token = req.headers.authorization;

  // decode token
  const decoded = jwt.verify(token, secretKey);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const data = {
      message: "Logged in user found",
      data: user,
    };

    res.json(data);
  } catch (error) {
    const data = {
      error: error.message,
    };

    res.status(500).json(data);
  }
};

exports.getApiKey = async (req, res) => {
  try {
    const apiKey = await generateKey();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil api key",
      data: {
        apiKey: apiKey,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data",
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
      message: "user_id not specified",
      data: dataUser,
    });
  }

  try {
    if (dataUser.role != "ADMIN" && user_id != dataUser.user_id) {
      return res.status(400).json({
        success: false,
        message: "You dont have permission to access this user",
        data: {},
      });
    }

    const result = await getUserById(user_id);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data",
      data: result,
    });
  } catch (error) {
    console.error("Error getting data:", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message,
      data: {},
    });
  }
};

exports.UpdateUser = async (req, res) => {};

exports.DeleteUser = async (req, res) => {};
