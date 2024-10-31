const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateHourlyAverages } = require('../utils/calculate');
const { convertTimeZone } = require('../utils/convertTimeZone');
const { DateTime } = require('luxon');

// tambah semua sensor data
exports.addSensorData = async (sensor, pju_id = null) => {
  const sensorPromises = sensor.map(async (sensorItem) => {
    const sensorType = await prisma.sensorType.findUnique({
      where: { code: sensorItem.sensorCode },
    });

    if (!sensorType) {
      throw new Error(`Sensor type with code ${sensorItem.sensorCode} not found`);
    }

    const devidedBy10SensorCode = ['NO2', 'SO2', 'O3']

    if (devidedBy10SensorCode.includes(sensorItem.sensorCode)) {
      sensorItem.value = (sensorItem.value / 10).toFixed(2); 
      sensorItem.value = parseFloat(sensorItem.value); 
    }
    

    if (sensorItem.sensor)

    return await prisma.sensorData.create({
      data: {
        value: sensorItem.value,
        sensorTypeId: sensorType.id,
        code: sensorItem.sensorCode,
        pju_id: pju_id,
      },
    });
  });

  return await Promise.all(sensorPromises);
};

// ambil semua data sensor terbaru
exports.getAllLatest = async () => {
  const sensorTypes = await prisma.sensorType.findMany();

  const latestSensorDataPromises = sensorTypes.map(async (sensorType) => {
    const sensor = await prisma.sensorData.findFirst({
      where: { sensorTypeId: parseInt(sensorType.id) },
      orderBy: { timestamp: 'desc' },
      include: { sensorType: true },
    });

    const covertedSensor = {
      ...sensor,
      timestamp: convertTimeZone(sensor.timestamp),
    };

    return covertedSensor;
  });

  return await Promise.all(latestSensorDataPromises);
};

// ambil data senosr berdasarkan kode
exports.getSensorType = async (sensorCode) => {
  return await prisma.sensorType.findUnique({
    where: { code: sensorCode },
  });
};

// memasukkan sensor baru
exports.createSensorType = async (sensorCode, unit, description) => {
  return await prisma.sensorType.create({
    data: {
      unit: unit,
      code: sensorCode,
      description: description,
    },
  });
};

// get sensor by filter
exports.getSensorByFilter = async (filter) => {
  try {
    const sensorTypes = await prisma.sensorType.findMany({
      where: {
        code: {
          in: filter,
        },
      },
    });

    if (sensorTypes.length === 0) {
      return [];
    }

    // get sensor by type
    const sensorDataPromises = sensorTypes.map(async (sensorType) => {
      const sensor = await prisma.sensorData.findFirst({
        where: {
          sensorTypeId: sensorType.id,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      const covertedSensor = {
        ...sensor,
        timestamp: convertTimeZone(sensor.timestamp),
      };

      return covertedSensor;
    });

    const sensorDataResults = await Promise.all(sensorDataPromises);

    return sensorDataResults.filter((data) => data !== null);
  } catch (error) {
    console.error('Error getting sensor data by filter:', error.message);
    throw new Error('Failed to get sensor data by filter');
  }
};

exports.getHourlySensorData = async (sensorCode, startDate, endDate, pjuId) => {
  const sensorData = await prisma.sensorData.findMany({
    where: {
      code: sensorCode,
      timestamp: {
        gte: startDate,
        lt: endDate,
      },
      pju_id: pjuId,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  const formattedSensorData = sensorData.map((data) => {
    data.timestamp = convertTimeZone(data.timestamp);

    return data;
  });

  return calculateHourlyAverages(formattedSensorData);
};

exports.DeleteSensorDataByTimestamp = async (timestamp, pjuId) => {
  await prisma.sensorData.deleteMany({
    where: {
      timestamp: {
        lt: timestamp,
      },
      pju_id: pjuId,
    },
  });
};

//
