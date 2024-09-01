const express = require("express");
const {
  GetDataSensor,
  AddDataSensor,
  GetSensorTypes,
  AddSensorType,
  GetDataSensorByType,
  GetLatestSensorDataByType,
} = require("../controller/sensor.js");
const { AddAll, GetAll } = require("../controller/request.js");
const { AddLampLog } = require("../controller/lamp.js");
const {
  LoginUser,
  RegisterUser,
  GetCurrentUser,
} = require("../controller/user.js");
const { authenticateToken } = require("../middleware/middleware.js");
const router = express.Router();

router.post("/data", AddDataSensor);
router.get("/data", GetDataSensor);
// router.get("/data/:sensor_id", GetDataSensorByType);
// router.get("/data/latest/:sensor_id", GetLatestSensorDataByType);

router.get("/types", GetSensorTypes);
router.post("/types", AddSensorType);

// fix all data sensor
router.post("/data/all", AddAll);
router.get("/data/all", GetAll);

// add log lamp from fe
router.post("/lamp/log", AddLampLog);

router.post("/login", LoginUser);
router.post("/register", authenticateToken, RegisterUser);

router.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

module.exports = router;
