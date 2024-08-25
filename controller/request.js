const express = require("express");
const router = express.Router();
const { getIo } = require("../socket");
const sensorService = require("../services/sensor.js");
const monitorService = require("../services/monitor.js");
const lampService = require("../services/lamp.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add All
exports.AddAll = async (req, res) => {
  try {
    const { sensor, pju } = req.body;

    let sensorData = null;
    let pjuData = {
      lamp: null,
      monitor: null,
    };

    if (sensor) {
      sensorData = await sensorService.addSensorData(sensor);
    }

    if (pju) {
      const lamp = pju.lamp;
      const monitor = pju.monitor;

      // send monitor data
      if (monitor) {
        pjuData.monitor = await monitorService.addMonitorData(monitor);
      }

      // send lamp log
      if (lamp) {
        pjuData.lamp = lampService.addLampLog(lamp);
      }

      // check if automated

      // check is lamp on off in same status
      const { isSame, success } = lampService.isLampStatusSame();
      if (!isSame && pjuData.lamp) {
        pjuData.lamp.on = !pjuData.lamp.on;
      }
    }

    // trigger fe
    // Initialize io and prepare data for socket emission
    const io = getIo();

    // Determine what data to emit based on conditions
    if (sensorData && pjuData) {
      // If both sensorData and lampData exist
      io.emit("dataUpdate", { sensorData, pjuData });
    } else if (sensorData) {
      // If only sensorData exists
      io.emit("dataUpdate", { sensorData });
    } else if (pjuData) {
      // If only lampData exists
      io.emit("dataUpdate", { pjuData });
    }

    res.status(201).json({
      success: true,
      message: "Data berhasil disimpan",
      data: {
        sensorData,
        pjuData,
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

// get last data sensor
exports.GetAll = async (req, res) => {
  try {
    // ambil data sensor
    const sensorData = await sensorService.getAllLatest();

    // ambil data monitor
    const lampData = await lampService.getLastLampLog();
    const monitorData = await monitorService.getAllLatest();

    res.status(200).json({
      success: true,
      message: "Data sensor terbaru berhasil diambil",
      data: {
        sensor: sensorData.filter((data) => data !== null), // Menghilangkan data yang null jika ada
        pju: {
          lamp: lampData,
          monitor: monitorData.filter((data) => data !== null),
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving latest sensor data:", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data sensor terbaru",
      error: error.message,
    });
  }
};
