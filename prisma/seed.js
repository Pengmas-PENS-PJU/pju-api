const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create sensor types
  const sensorTypes = [
    { name: 'Temperature', unit: '°C' },
    { name: 'Humidity', unit: '%' },
    { name: 'Pressure', unit: 'hPa' },
    { name: 'PM2.5', unit: 'µg/m³' },
    { name: 'PM10', unit: 'µg/m³' },
    { name: 'CO', unit: 'ppm' },
    { name: 'CO2', unit: 'ppm' },
    { name: 'O3', unit: 'ppm' },
    { name: 'NO2', unit: 'ppm' },
    { name: 'SO2', unit: 'ppm' },
    { name: 'NH3', unit: 'ppm' },
    { name: 'H2S', unit: 'ppm' },
    { name: 'CH4', unit: 'ppm' }
  ];

  const createdSensorTypes = await prisma.sensorType.createMany({
    data: sensorTypes,
    skipDuplicates: true, // Avoid duplicating sensor types if they already exist
  });

  console.log(`Created ${createdSensorTypes.count} sensor types`);

  // Create sensor data examples
  const exampleSensorData = [
    { value: 25.3, sensorTypeId: 1 },
    { value: 27.1, sensorTypeId: 1 },
    { value: 45.2, sensorTypeId: 2 },
    { value: 50.8, sensorTypeId: 2 },
    { value: 1013, sensorTypeId: 3 },
    { value: 1010, sensorTypeId: 3 },
    { value: 12.5, sensorTypeId: 4 },
    { value: 25.0, sensorTypeId: 5 },
    { value: 0.9, sensorTypeId: 6 },
    { value: 400, sensorTypeId: 7 },
    { value: 0.05, sensorTypeId: 8 },
    { value: 0.02, sensorTypeId: 9 },
    { value: 0.01, sensorTypeId: 10 },
    { value: 1.5, sensorTypeId: 11 },
    { value: 0.03, sensorTypeId: 12 },
    { value: 2.1, sensorTypeId: 13 }
  ];

  await prisma.sensorData.createMany({
    data: exampleSensorData,
  });

  console.log(`Created ${exampleSensorData.length} sensor data entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
