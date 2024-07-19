const express = require("express");
const { getIo } = require("../socket");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// tambah data sensor
exports.AddDataSensor = async (req, res) => {
  const { value, sensorTypeId } = req.body;
  try {
    const sensorData = await prisma.sensorData.create({
      data: {
        value: parseFloat(value),
        sensorTypeId: parseInt(sensorTypeId),
      },
    });
    const io = getIo();
    io.emit("dataUpdate", sensorData);
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ambil data sensor
exports.GetDataSensor = async (req, res) => {
  try {
    const sensorData = await prisma.sensorData.findMany({
      include: { sensorType: true },
      orderBy: { timestamp: "desc" },
    });
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// tambah jenis sensor
exports.AddSensorType = async (req, res) => {
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
};

// ambil jenis sensor
exports.GetSensorTypes = async (req, res) => {
  try {
    const sensorTypes = await prisma.sensorType.findMany();
    res.json(sensorTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
