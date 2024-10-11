const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const sensorTypes = [
  { name: 'Wind Speed', code: 'WINDSPD', unit: 'm/s' },
  { name: 'Wind Direction', code: 'WINDDIR', unit: '°' },
  { name: 'Solar Radiation', code: 'SOLAR', unit: 'W/m²' },
  { name: 'Humidity', code: 'HUM', unit: '%' },
  { name: 'Temperature', code: 'TEMP', unit: '°C' },
  { name: 'Air Pressure', code: 'PRESS', unit: 'mbar' },
  { name: 'Rainfall Level', code: 'RAINFL', unit: 'mm' },
  { name: 'Particulate Matter 2.5', code: 'PM2.5', unit: 'µg/m³' },
  { name: 'Particulate Matter 10', code: 'PM10', unit: 'µg/m³' },
  { name: 'Carbon Dioxide', code: 'CO2', unit: 'ppm' },
  { name: 'Oxygen', code: 'O2', unit: '%VOL' },
  { name: 'Sulfur Dioxide', code: 'SO2', unit: 'ppm' },
  { name: 'Nitrogen Dioxide', code: 'NO2', unit: 'ppm' },
  { name: 'Ozone', code: 'O3', unit: 'ppm' },
];

const MonitorTypes = [
  { name: 'Voltage', code: 'VOLT', unit: 'V' },
  { name: 'Current', code: 'CURR', unit: 'A' },
  { name: 'Power', code: 'POW', unit: 'Watt' },
  { name: 'Temperature', code: 'TEMP', unit: '°C' },
  { name: 'Luminouse Intensity', code: 'LUM', unit: 'Lux' },
];

async function main() {
  console.log(process.env.DATABASE_URL);
  // Insert SensorType data
  const createdSensorTypes = await prisma.sensorType.createMany({
    data: sensorTypes,
    skipDuplicates: true, // Avoid duplicating sensor types if they already exist
  });

  console.log(`Created ${createdSensorTypes.count} sensor types`);

  const createdMonitorTypes = await prisma.monitorType.createMany({
    data: MonitorTypes,
    skipDuplicates: true, // Avoid duplicating monitor types if they already exist
  });

  console.log(`Created ${createdSensorTypes.count} monitor types`);

  // create role
  const roles = [
    {
      code: 'admin',
      name: 'Administator',
    },
    {
      code: 'operator',
      name: 'Operator',
    },
  ];

  const createdRoles = await prisma.role.createMany({
    data: roles,
    skipDuplicates: true,
  });

  // generate admin user
  const ExistAdmin = await prisma.user.findFirst();
  if (!ExistAdmin) {
    if (process.env.ADMIN_EMAIL != '' || process.env.ADMIN_EMAIL != null) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role_code: 'admin',
        },
      });

      console.log('Created admin user kredentials from env');
    } else {
      const hashedPassword = await bcrypt.hash('adminMSIB', 10);

      const user = await prisma.user.create({
        data: {
          email: 'admin@gmail.com',
          password: hashedPassword,
        },
      });

      console.log('Created default admin user');
    }
  }

  const pjuData = [
    {
      name: 'PJU 1',
      description: 'PJU 1',
    },
    {
      name: 'PJU 2',
      description: 'PJU 2',
    },
  ];

  const createPjuData = await prisma.pju.createMany({
    data: pjuData,
    skipDuplicates: true,
  });

  console.log(`Created ${createPjuData.count} pju data`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
