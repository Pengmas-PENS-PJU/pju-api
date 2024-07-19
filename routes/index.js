const express = require("express");
const {
  GetDataSensor,
  AddDataSensor,
  GetSensorTypes,
  AddSensorType,
} = require("../controller/sensor.js");
const router = express.Router();

router.post("/data", AddDataSensor);
router.get("/data", GetDataSensor);

router.get("/types", GetSensorTypes);
router.post("/types", AddSensorType);

module.exports = router;
