// validate sensor
const validateSensorPayload = (sensor, allowedSensorCodes) => {
  if (!sensor || !Array.isArray(sensor)) {
    return {
      valid: false,
      message: "Data tidak boleh kosong atau format tidak valid",
    };
  }

  const invalidSensors = sensor.filter(
    (sensorItem) => !allowedSensorCodes.includes(sensorItem.sensorCode)
  );
  const invalidValues = sensor.filter(
    (sensorItem) =>
      typeof sensorItem.value !== "number" || isNaN(sensorItem.value)
  );

  if (invalidSensors.length > 0) {
    return {
      valid: false,
      message: `Sensor code tidak valid: ${invalidSensors
        .map((item) => item.sensorCode)
        .join(", ")}`,
    };
  }

  if (invalidValues.length > 0) {
    return {
      valid: false,
      message: `Field value harus berupa angka (float) untuk sensor: ${invalidValues
        .map((item) => item.sensorCode)
        .join(", ")}`,
    };
  }

  return { valid: true };
};

// validate monitor
const validateMonitorPayload = (sensor, allowedMonitorCodes) => {
  if (!sensor || !Array.isArray(sensor)) {
    return {
      valid: false,
      message: "Data tidak boleh kosong atau format tidak valid",
    };
  }

  const invalidSensors = sensor.filter(
    (sensorItem) => !allowedMonitorCodes.includes(sensorItem.attributeCode)
  );
  const invalidValues = sensor.filter(
    (sensorItem) =>
      typeof sensorItem.value !== "number" || isNaN(sensorItem.value)
  );

  if (invalidSensors.length > 0) {
    return {
      valid: false,
      message: `Sensor code tidak valid: ${invalidSensors
        .map((item) => item.attributeCode)
        .join(", ")}`,
    };
  }

  if (invalidValues.length > 0) {
    return {
      valid: false,
      message: `Field value harus berupa angka (float) untuk sensor: ${invalidValues
        .map((item) => item.attributeCode)
        .join(", ")}`,
    };
  }

  return { valid: true };
};

// validate lamplog
const validateLampLogPayload = (lamp) => {
  console.log("automated", lamp.automated);

  if (!lamp) {
    return {
      valid: false,
      message: "Data tidak boleh kosong",
    };
  }

  if (typeof lamp.isPJU !== "boolean") {
    return {
      valid: false,
      message: "IsPju harus bertipe boolean",
    };
  }

  if (typeof lamp.automated !== "boolean") {
    return {
      valid: false,
      message: "automated harus bertipe boolean",
    };
  }

  if (typeof lamp.on !== "boolean") {
    return {
      valid: false,
      message: "on harus bertipe boolean",
    };
  }

  return { valid: true };
};

const validateLampLogParam = (lamp) => {
  if (lamp == "true" || lamp == true || lamp == 1) {
    return true;
  }

  if (lamp == "false" || lamp == false || lamp == 0) {
    return false;
  }

  if (typeof lamp === "undefined") {
    return true;
  }
};

module.exports = {
  validateSensorPayload,
  validateMonitorPayload,
  validateLampLogPayload,
  validateLampLogParam,
};
