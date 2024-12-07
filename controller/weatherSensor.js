const express = require('express');
const router = express.Router();
const { getIo } = require('../socket');
const sensorService = require('../services/sensor.js');
const { validateSensorPayload } = require('../validate/validate.js');
const pjuService = require('../services/pjuService.js');
const configService = require('../services/configService.js');
const { DateTime } = require('luxon');
const { toXlsx } = require('../utils/export.js');

const allowedSensorCodes = ['HUM', 'TEMP', 'SOLAR', 'RAINFL', 'PRESS', 'WINDSPD', 'WINDDIR'];

// post data
exports.AddWeatherData = async (req, res) => {
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
    await configService.checkDataSentConfig(ValidPjuId, 'weather');

    if (sensor) {
      result = await sensorService.addSensorData(sensor, ValidPjuId);

      const startOfDayInUTC = DateTime.now().setZone('Asia/Jakarta').startOf('day').toUTC().toJSDate();

      await sensorService.DeleteSensorDataByTimestamp(startOfDayInUTC, ValidPjuId);
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
      io.emit('weatherUpdate', result);
    }

    return res.status(201).json({
      success: true,
      message: 'Berhasil memasukkan data',
      data: result,
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

// get weather sensor data
exports.GetWeatherData = async (req, res) => {
  try {
    const weatherData = await sensorService.getSensorByFilter(allowedSensorCodes);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data',
      data: weatherData,
    });
  } catch (error) {
    console.error('Error getting monitor data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data',
      error: error.message,
      data: {},
    });
  }
};


// export weather data
exports.ExportWeatherData = async (req, res) => {

  const paramStartDate = req.query.startDate ?? null;
  const paramEndDate = req.query.endDate ?? null;
  try {

    const startDate = paramStartDate != null ? DateTime.fromISO(paramStartDate, { zone: 'Asia/Jakarta' }).startOf('day').toJSDate() : null;
    const endDate = paramEndDate != null ? DateTime.fromISO(paramEndDate, { zone: 'Asia/Jakarta' }).endOf('day').toJSDate() : null;

    const weatherData = await sensorService.GetSensorDataByRange(
      allowedSensorCodes,
      startDate,
      endDate
    );

    if (weatherData.length > 0) {
      const workbook = await toXlsx(weatherData);
      const filename = `Weather_${DateTime.now().setZone("Asia/Jakarta").toFormat("yyyy-LL-dd_HH-mm-ss")}.xlsx`;
      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition",`attachment; filename="${filename}"`);

      return res.status(200).send(buffer);

  } else {
      return res.status(404).json({
          success: false,
          message: "Tidak ada data yang ditemukan untuk rentang tanggal ini.",
      });
  }
    
  } catch (error) {
    console.error('Error getting monitor data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data',
      error: error.message,
      data: {},
    });
  }
}
