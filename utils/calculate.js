const { DateTime } = require('luxon');

exports.calculateHourlyAverages = (data) => {
  const hourlyData = {};

  data.forEach((dataPoint) => {
    // Pastikan timezone Asia/Jakarta
    const hour = DateTime.fromISO(dataPoint.timestamp, { zone: 'Asia/Jakarta' }).hour;

    // Set hour as index
    if (!hourlyData[hour]) {
      hourlyData[hour] = [];
    }

    hourlyData[hour].push(dataPoint.value);
  });

  const hourlyAverages = Object.keys(hourlyData).map((hour) => {
    const values = hourlyData[hour];
    const average = values.reduce((sum, value) => sum + parseFloat(value), 0) / values.length;

    return {
      hour: parseInt(hour),
      averageValue: parseFloat(average.toFixed(1)),
    };
  });

  return hourlyAverages;
};
