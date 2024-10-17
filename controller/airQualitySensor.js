const express = require('express');
const router = express.Router();
const { getIo } = require('../socket');
const sensorService = require('../services/sensor.js');
const { validateSensorPayload } = require('../validate/validate.js');
const pjuService = require('../services/pjuService.js');
const configService = require('../services/configService.js');
const { getAirQualityISPU } = require('../services/airQualityService.js');

const allowedSensorCodes = ['CO2', 'O2', 'NO2', 'O3', 'PM2.5', 'PM10', 'SO2'];

// add data
exports.AddAirQualityData = async (req, res) => {
  const { sensor, pju_id } = req.body;

  try {
    const validation = validateSensorPayload(sensor, allowedSensorCodes);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        data: {},
      });
    }

    // set pju
    let ValidPjuId = pjuService.setPjuDefault(pju_id);

    await pjuService.getPjuById(ValidPjuId);

    // check config
    await configService.checkDataSentConfig(ValidPjuId, 'air_quality');

    if (sensor) {
      result = await sensorService.addSensorData(sensor, ValidPjuId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Data tidak boleh kosong',
        data: {},
      });
    }

    // trigger frontend
    if (result) {
      const io = getIo();
      io.emit('airQualityUpdate', result);
    }

    return res.status(201).json({
      success: true,
      message: 'Berhasil memasukkan data',
      data: result,
    });
  } catch (error) {
    console.error('Error saving data:', error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data',
      error: error.message,
      data: {},
    });
  }
};

// get data
exports.GetAirQualityData = async (req, res) => {
  try {
    const airQualityData = await sensorService.getSensorByFilter(allowedSensorCodes);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data',
      data: airQualityData,
    });
  } catch (error) {
    console.error('Error getting monitor data:', error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data',
      error: error.message,
      data: {},
    });
  }
};

exports.GetAirQualityISPU = async (req, res) => {
  const { pjuId } = req.params;
  const pjuIdInt = parseInt(pjuId);

  try {
    const data = await getAirQualityISPU(pjuIdInt);

    return res.status(200).json({
      success: true,
      message: 'Air quality ISPU retrieved successfully',
      data: data,
      error_details: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
      error_details: null,
    });
  }
};
