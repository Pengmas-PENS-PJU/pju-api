const express = require("express");
const router = express.Router();
const { getIo } = require("../socket");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  validateLampLogPayload,
  validateLampLogParam,
} = require("../validate/validate.js");
const lampService = require("../services/lamp.js");

// Add Lamp Data
exports.saveLampLog = async (req, res) => {
  const { on, automated, isPJU } = req.body;
  console.log(req.body);

  try {
    const lamp = {
      on: on,
      automated: automated,
      isPJU: isPJU,
    };

    const validation = validateLampLogPayload(lamp);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        data: {},
      });
    }

    const result = await lampService.addLampLog(lamp);

    // if from pju
    if (isPJU) {
      // trigger client
      if (result) {
        const io = getIo();
        io.emit("lampUpdate", result);
      }

      const check = await lampService.isLampStatusSame();

      if (check.success) {
        return res.status(201).json({
          success: true,
          message: "Data berhasil disimpan",
          change_status: !check.isSame,
          config: check.config,
          value: check.value,
          data: {
            client_status: check.clientLampStatus,
            pju_status: result,
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Pengecekan log lamp error",
          data: {},
          error: check.error,
        });
      }

      // if from client
    } else {
      return res.status(201).json({
        success: true,
        message: "Data berhasil disimpan",
        data: result,
      });
    }
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

exports.getLastLampStatus = async (req, res) => {
  const isPJU = req.params.isPJU;

  try {
    const src = validateLampLogParam(isPJU);

    const lamp = await lampService.getLastLampLog(src);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data",
      data: lamp,
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
