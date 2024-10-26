exports.calculateHourlyAverages = (data) => {
  const hourlyData = {};

  data.forEach((dataPoint) => {
    const hour = new Date(dataPoint.timestamp).getHours();

    // set hour as index
    if (!hourlyData[hour]) {
      hourlyData[hour] = [];
    }

    hourlyData[hour].push(dataPoint.value);
  });

  // calculate every index
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
