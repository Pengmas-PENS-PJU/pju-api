const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Endpoint untuk menambahkan data sensor
router.post("/data", async (req, res) => {
  const { value, sensorTypeId } = req.body;
  try {
    const sensorData = await prisma.sensorData.create({
      data: {
        value: parseFloat(value),
        sensorTypeId: parseInt(sensorTypeId),
      },
    });
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk mendapatkan semua data sensor
router.get("/data", async (req, res) => {
  try {
    const sensorData = await prisma.sensorData.findMany({
      include: { sensorType: true },
    });
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk menambahkan jenis sensor
router.post("/type", async (req, res) => {
  const { name, unit } = req.body;
  try {
    const sensorType = await prisma.sensorType.create({
      data: {
        name,
        unit,
      },
    });
    res.json(sensorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk mendapatkan semua jenis sensor
router.get("/type", async (req, res) => {
  try {
    const sensorTypes = await prisma.sensorType.findMany();
    res.json(sensorTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
