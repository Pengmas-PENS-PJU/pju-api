const prisma = require('../configs/prisma');
const NO2Conversion = require('../utils/ispu/ispuNO2');
const PM10Conversion = require('../utils/ispu/ispuPM10');
const PM25Conversion = require('../utils/ispu/ispuPM25');
const SO2Conversion = require('../utils/ispu/ispuSO2');
const O3Conversion = require('../utils/ispu/O3');

let dataExists = false;

const getAirQualityISPU = async (pjuId) => {
  const PM25Average = await getAverageValueOneDayBySensorCode(pjuId, 'PM2.5');
  const PM10Average = await getAverageValueOneDayBySensorCode(pjuId, 'PM10');
  const O3Average = await getAverageValueOneDayBySensorCode(pjuId, 'O3');
  const NO2Average = await getAverageValueOneDayBySensorCode(pjuId, 'NO2');
  const SO2Average = await getAverageValueOneDayBySensorCode(pjuId, 'SO2');

  const PM25ISPUCategory = getMinAndMaxISPUByValue(PM25Average, PM25Conversion);
  const PM10ISPUCategory = getMinAndMaxISPUByValue(PM10Average, PM10Conversion);
  const O3ISPUCategory = getMinAndMaxISPUByValue(O3Average, O3Conversion);
  const NO2ISPUCategory = getMinAndMaxISPUByValue(NO2Average, NO2Conversion);
  const SO2ISPUCategory = getMinAndMaxISPUByValue(SO2Average, SO2Conversion);

  const PM25ISPU = calculateISPU(PM25ISPUCategory.ispuMax, PM25ISPUCategory.ispuMin, PM25ISPUCategory.valueMax, PM25ISPUCategory.valueMin, PM25Average);
  const PM10ISPU = calculateISPU(PM10ISPUCategory.ispuMax, PM10ISPUCategory.ispuMin, PM10ISPUCategory.valueMax, PM10ISPUCategory.valueMin, PM10Average);
  const O3ISPU = calculateISPU(O3ISPUCategory.ispuMax, O3ISPUCategory.ispuMin, O3ISPUCategory.valueMax, O3ISPUCategory.valueMin, O3Average);
  const NO2ISPU = calculateISPU(NO2ISPUCategory.ispuMax, NO2ISPUCategory.ispuMin, NO2ISPUCategory.valueMax, NO2ISPUCategory.valueMin, NO2Average);
  const SO2ISPU = calculateISPU(SO2ISPUCategory.ispuMax, SO2ISPUCategory.ispuMin, SO2ISPUCategory.valueMax, SO2ISPUCategory.valueMin, SO2Average);

  const averageAllISPU = (PM25ISPU + PM10ISPU + O3ISPU + NO2ISPU + SO2ISPU) / 5;
  const ispuCategory = getISPUCategory(averageAllISPU);

  return {
    ispu_value: averageAllISPU,
    ispu_category: ispuCategory,
    data_exists: dataExists,
  };
};

const getAverageValueOneDayBySensorCode = async (pjuId, sensorCode) => {
  const sensorData = await prisma.sensorData.findMany({
    where: {
      pju_id: pjuId,
      code: sensorCode,
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  if (sensorData.length === 0) {
    dataExists = false;
  } else {
    dataExists = true;
  }

  return calculateAverages(sensorData);
};

const calculateAverages = (sensorData) => {
  if (sensorData.length === 0) return 0;
  const sum = sensorData.reduce((acc, data) => acc + data.value, 0);
  return sum / sensorData.length;
};

/**
 * Calculate ISPU value based on the ISPU value of two different pollutants
 * @param {number} Ia ISPU max
 * @param {number} Ib ISPU min
 * @param {number} Xa Max value of pollutant
 * @param {number} Xb Min value of pollutant
 * @param {number} Xx Actual value of pollutant
 * @returns {number} ISPU value of pollutant X
 */
const calculateISPU = (Ia, Ib, Xa, Xb, Xx) => {
  return ((Ia - Ib) / (Xa - Xb)) * (Xx - Xb) + Ib;
};

const getMinAndMaxISPUByValue = (value, conversionData) => {
  let ispu = '';
  Object.keys(conversionData).forEach((key) => {
    if (value >= conversionData[key].valueMin && value <= conversionData[key].valueMax) {
      ispu = key;
    }
  });
  return conversionData[ispu];
};

const getISPUCategory = (ispu) => {
  if (ispu >= 0 && ispu <= 50) {
    return 'good';
  } else if (ispu >= 51 && ispu <= 100) {
    return 'moderate';
  } else if (ispu >= 101 && ispu <= 200) {
    return 'unhealty';
  } else if (ispu >= 201 && ispu <= 300) {
    return 'very_unhealty';
  } else if (ispu > 300) {
    return 'hazardous';
  } else {
    return 'unknown';
  }
};

module.exports = {
  getAirQualityISPU,
};
