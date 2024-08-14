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
        sensorType: {
          connect: { id: sensorTypeId },
        },
      },
    });

    // trigger event dataUpdate di client
    const io = getIo();
    io.emit("dataUpdate", sensorData);

    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create new sensor data

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

// ambil data tertentu berdasarkan type sensor
exports.GetDataSensorByType = async (req, res) => {
  const sensor_id = req.params.sensor_id;
  try {
    const sensorData = await prisma.sensorData.findMany({
      where: { sensorTypeId: sensor_id },
      include: { sensorType: true },
      orderBy: { timestamp: "desc" },
    });
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.GetLatestSensorDataByType = async (req, res) => {
  const sensor_id = req.params.sensor_id;
  try {
    const sensorData = await prisma.sensorData.findFirst({
      where: { sensorTypeId: sensor_id },
      include: { sensorType: true },
      orderBy: { timestamp: "desc" },
    });
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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

