const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// tambah semua sensor data
exports.addSensorData = async (sensor) => {
  const sensorPromises = sensor.map(async (sensorItem) => {
    const sensorType = await prisma.sensorType.findUnique({
      where: { code: sensorItem.sensorCode },
    });

    if (!sensorType) {
      throw new Error(
        `Sensor type with code ${sensorItem.sensorCode} not found`
      );
    }

    return await prisma.sensorData.create({
      data: {
        value: sensorItem.value,
        sensorTypeId: sensorType.id,
      },
      include: { sensorType: true },
    });
  });

  return await Promise.all(sensorPromises);
};

// ambil semua data sensor terbaru
exports.getAllLatest = async () => {
  const sensorTypes = await prisma.sensorType.findMany();

  const latestSensorDataPromises = sensorTypes.map(async (sensorType) => {
    return await prisma.sensorData.findFirst({
      where: { sensorTypeId: parseInt(sensorType.id) },
      orderBy: { timestamp: "desc" },
      include: { sensorType: true },
    });
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
