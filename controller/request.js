const express = require('express');
const router = express.Router();
const { getIo } = require('../socket');
const lampLib = require('../lib/lampLog');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add All
exports.AddAll = async (req, res) => {
  try {
    const { sensor, pju } = req.body;

    let sensorData = null;

    if (sensor) {
      const sensorPromises = sensor.map(async (sensorItem) => {
        const sensorType = await prisma.sensorType.findUnique({
          where: { code: sensorItem.sensorCode },
        });

        if (!sensorType) {
          throw new Error(`Sensor type with code ${sensorItem.sensorCode} not found`);
        }

        return await prisma.sensorData.create({
          data: {
            value: sensorItem.value,
            sensorTypeId: sensorType.id,
          },
          include: { sensorType: true },
        });
      });

      // wait till done
      sensorData = await Promise.all(sensorPromises);
    }

    let lampData = null;

    if (pju) {
      const lamp = pju.lamp;
      
      if (lamp) {
        lampData = await prisma.lampLog.create({
          data: {
            on: lamp.on,
            brightness: lamp.brightness,
            isPJU: lamp.isPJU,
          },
        });
      }

      // check is lamp log in same status
      const { isSame, success } = lampLib.isLampStatusSame();
      if (!isSame && lampData) {
        lampData.on = !lampData.on;
      }
    }

    // trigger fe
    const io = getIo();
    io.emit('dataUpdate', { sensorData, lampData });

    res.status(201).json({
      success: true,
      message: 'Data berhasil disimpan',
      error: '',
      data: {
        sensorData,
        lampData,
      },
    });
  } catch (error) {
    console.error('Error saving data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data',
      error: error.message,
      data: {},
    });
  }
};

// get last data sensor
exports.GetAll = async (req, res) => {
  try {
    const sensorTypes = await prisma.sensorType.findMany();

    // get all sensor data
    const latestSensorDataPromises = sensorTypes.map(async (sensorType) => {
      return await prisma.sensorData.findFirst({
        where: { sensorTypeId: parseInt(sensorType.id) },
        orderBy: { timestamp: 'desc' },
        include: { sensorType: true },
      });
    });

    // wait till done
    const latestSensorData = await Promise.all(latestSensorDataPromises);

    const lamp = await prisma.lampLog.findFirst({
      where: { isPJU: false },
      orderBy: { timestamp: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: 'Data sensor terbaru berhasil diambil',
      data: {
        sensor: latestSensorData.filter((data) => data !== null), // Menghilangkan data yang null jika ada
        lamp: lamp,
      },
    });
  } catch (error) {
    console.error('Error retrieving latest sensor data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data sensor terbaru',
      error: error.message,
    });
  }
};
