const express = require("express");
const {
  GetDataSensor,
  AddDataSensor,
  GetSensorTypes,
  AddSensorType,
  GetDataSensorByType,
  GetLatestSensorDataByType
} = require("../controller/sensor.js");
const { LoginUser, RegisterUser } = require("../controller/user.js");
const { authenticateToken } = require("../middleware/middleware.js");
const router = express.Router();

router.post("/data", AddDataSensor);
router.get("/data", GetDataSensor);
router.get("/data/:sensor_id", GetDataSensorByType);
router.get("/data/latest/:sensor_id", GetLatestSensorDataByType);

router.get("/types", GetSensorTypes);
router.post("/types", AddSensorType);

router.post("/login", LoginUser);
router.post("/register", RegisterUser);

router.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

module.exports = router;
