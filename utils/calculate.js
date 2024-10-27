const { DateTime } = require('luxon');

exports.calculateHourlyAverages = (data) => {
  const hourlyData = {};

  data.forEach((dataPoint) => {
    // `timestamp` sudah dalam format string yang sesuai zona waktu Asia/Jakarta
    const hour = DateTime.fromISO(dataPoint.timestamp).hour;

    // Set hour as index
    if (!hourlyData[hour]) {
      hourlyData[hour] = [];
    }

    hourlyData[hour].push(dataPoint.value);
  });

  // Calculate every index
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
