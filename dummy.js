const axios = require('axios');
const cron = require('node-cron');

// Fungsi untuk mengirimkan data dummy
async function sendDummyData() {
  const sensorTypes = [
    { id: 1, name: 'Temperature', unit: '°C' },
    { id: 2, name: 'Humidity', unit: '%' },
    { id: 3, name: 'Pressure', unit: 'hPa' },
    { id: 4, name: 'PM2.5', unit: 'µg/m³' },
    { id: 5, name: 'PM10', unit: 'µg/m³' },
    { id: 6, name: 'CO', unit: 'ppm' },
    { id: 7, name: 'CO2', unit: 'ppm' },
    { id: 8, name: 'O3', unit: 'ppm' },
    { id: 9, name: 'NO2', unit: 'ppm' },
    { id: 10, name: 'SO2', unit: 'ppm' },
    { id: 11, name: 'NH3', unit: 'ppm' },
    { id: 12, name: 'H2S', unit: 'ppm' },
    { id: 13, name: 'CH4', unit: 'ppm' }
  ];

  for (const sensorType of sensorTypes) {
    const data = {
      value: (Math.random() * 100).toFixed(2),
      sensorTypeId: sensorType.id,
    };

    try {
        console.log('Data:', data)
      await axios.post('http://localhost:3000/sensor/data', data);
      console.log(`Data sent for ${sensorType.name}:`, data);
    } catch (error) {
      console.error(`Error sending data for ${sensorType.name}:`, error.message);
    }
  }
}

// Menjadwalkan pengiriman data dummy setiap 10 menit sekali
cron.schedule('*/10 * * * *', () => {
  console.log('Sending dummy data...');
  sendDummyData();
});

console.log('Dummy data sender started');
