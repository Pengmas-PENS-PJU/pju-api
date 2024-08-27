const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

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

    res.json({ message: "User registered successfully", data: userWithoutPassword });
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

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
