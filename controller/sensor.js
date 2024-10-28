const express = require('express');
const { getIo } = require('../socket');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sensor = require('../services/sensor');
const pjuService = require('../services/pjuService.js');
const configService = require('../services/configService.js');
const { DateTime } = require('luxon');

const allowedSensorCodes = ['CO2', 'O2', 'NO2', 'O3', 'PM2.5', 'PM10', 'SO2', 'HUM', 'TEMP', 'SOLAR', 'RAINFL', 'PRESS', 'WINDSPD', 'WINDDIR'];

// tambah data sensor
exports.AddDataSensor = async (req, res) => {
  const { value, sensorTypeId, code } = req.body;
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
    io.emit('dataUpdate', sensorData);

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
      orderBy: { timestamp: 'desc' },
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
      orderBy: { timestamp: 'desc' },
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
      orderBy: { timestamp: 'desc' },
    });
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// tambah jenis sensor
exports.AddSensorType = async (req, res) => {
  const { name, unit, code } = req.body;
  try {
    const sensorType = await prisma.sensorType.create({
      data: {
        name: name,
        unit: unit,
        code: code,
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

// get data sensor hourly
exports.GetSensorDataHourly = async (req, res) => {
  // const sensorCode = req.params.userId;
  // const date = req.params.date;
  // const pju_id = req.params.pjuId;

  const sensorCode = req.query.sensorCode;
  const date = req.query.date;
  const pju_id = parseInt(req.query.pjuId, 10);

  try {
    // check sensor code
    if (!allowedSensorCodes.includes(sensorCode)) {
      return res.status(400).json({
        success: false,
        message: 'Sensor code ' + sensorCode + ' is not allowed',
        data: {},
      });
    }

    // check date
    if (typeof date == 'undefined' || date == null) {
      return res.status(400).json({
        success: false,
        message: 'Date is required',
        data: {},
      });
    }

    const startDate = DateTime.fromISO(date, { zone: 'Asia/Jakarta' }).startOf('day').toJSDate();
    const endDate = DateTime.fromISO(date, { zone: 'Asia/Jakarta' }).endOf('day').toJSDate();

    // check if pju exist
    await pjuService.getPjuById(pju_id);

    const result = await sensor.getHourlySensorData(sensorCode, startDate, endDate, pju_id);

    return res.status(200).json({
      success: true,
      message: 'Berhasl mengambil data',
      data: result,
    });
  } catch (error) {
    console.error('Error getting data:', error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: 'Terjadi kesalahan mengambil data',
      error: error.message,
      data: {},
    });
  }
};
