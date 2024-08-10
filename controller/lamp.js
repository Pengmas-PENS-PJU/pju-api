const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add Lamp Data
exports.AddLampLog = async (req, res) => {
  const { on, brightness } = req.body;

  try {
    const lampLog = await prisma.lampLog.create({
      data: {
        on: on,
        brightness: brightness,
        isPJU: false,
      },
    });

    res.status(201).json({
      success: true,
      message: "Data berhasil disimpan",
      error: "",
      data: {
        lampLog,
      },
    });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan data",
      error: error.message,
      data: {},
    });
  }
};
