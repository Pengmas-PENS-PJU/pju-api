const express = require("express");
const router = express.Router();
const { getIo } = require("../socket");
const monitorService = require("../services/monitor.js");
const { validateMonitorPayload } = require("../validate/validate.js");

const allowedMonitorCodes = ["VOLT", "CURR", "POW", "TEMP", "LUM"];

exports.AddMonitorData = async (req, res) => {
  const { monitor } = req.body;

  try {
    const validation = validateMonitorPayload(monitor, allowedMonitorCodes);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        data: {},
      });
    }

    if (monitor) {
      result = await monitorService.addMonitorData(monitor);
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
      io.emit("monitorUpdate", result);
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

// get monitor data
exports.GetMonitorData = async (req, res) => {
  try {
    const monitorData = await monitorService.getMonitorByFilter(
      allowedMonitorCodes
    );
    // const monitorData = await monitorService.getAllLatest();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data",
      data: monitorData,
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
