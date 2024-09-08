const express = require("express");
const router = express.Router();
const { getIo } = require("../socket");
const sensorService = require("../services/sensor.js");
const { validateSensorPayload } = require("../validate/validate.js");

const allowedSensorCodes = [
  "HUM",
  "TEMP",
  "SOLAR",
  "RAINFL",
  "PRESS",
  "WINDSPD",
  "WINDDIR",
];

// post data
exports.AddWeatherData = async (req, res) => {
  const { sensor } = req.body;

  try {
    const validation = validateSensorPayload(sensor, allowedSensorCodes);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        data: {},
      });
    }

    if (sensor) {
      result = await sensorService.addSensorData(sensor);
    } else {
      return res.status(400).json({
        success: false,
        message: "Data tidak boleh kosong",
        data: {},
      });
    }

    // trigger frontend
    if (result) {
      const io = getIo();
      io.emit("weatherUpdate", result);
    }

    return res.status(201).json({
      success: true,
      message: "Berhasil memasukkan data",
      data: result,
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

// get weather sensor data
exports.GetWeatherData = async (req, res) => {
  try {
    const weatherData = await sensorService.getSensorByFilter(
      allowedSensorCodes
    );

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data",
      data: weatherData,
    });
  } catch (error) {
    console.error("Error getting monitor data:", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message,
      data: {},
    });
  }
};
