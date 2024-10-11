const express = require("express");
const {
  GetDataSensor,
  AddDataSensor,
  GetSensorTypes,
  AddSensorType,
  GetDataSensorByType,
  GetLatestSensorDataByType,
} = require("../controller/sensor.js");
const {
  AddWeatherData,
  GetWeatherData,
} = require("../controller/weatherSensor.js");
const {
  AddAirQualityData,
  GetAirQualityData,
} = require("../controller/airQualitySensor.js");
const { AddMonitorData, GetMonitorData } = require("../controller/monitor.js");
const { AddAll, GetAll } = require("../controller/request.js");
const {
  AddLampLog,
  saveLampLog,
  getLastLampStatus,
} = require("../controller/lamp.js");
const {
  LoginUser,
  RegisterUser,
  GetCurrentUser,
  getApiKey,
  GetAllUser,
  UpdateUser,
  DeleteUser,
  GetUser,
} = require("../controller/user.js");
const {
  authenticateToken,
  validateKey,
} = require("../middleware/middleware.js");

// Stream
const Ffmpeg = require("fluent-ffmpeg");
const MjpegServer = require("mjpeg-server");

const router = express.Router();

// router.post("/data", AddDataSensor);
// router.get("/data", GetDataSensor);
// router.get("/data/:sensor_id", GetDataSensorByType);
// router.get("/data/latest/:sensor_id", GetLatestSensorDataByType);

// router.get("/types", GetSensorTypes);
// router.post("/types", AddSensorType);

// all data sensor
// router.post("/data/all", AddAll);
// router.get("/data/all", GetAll);

// weather only
router.get("/weather", GetWeatherData);
router.post("/weather", validateKey, AddWeatherData);

// air quality only
router.get("/air-quality", GetAirQualityData);
router.post("/air-quality", validateKey, AddAirQualityData);

// monitor only
router.get("/monitor", GetMonitorData);
router.post("/monitor", validateKey, AddMonitorData);

// lamp only
router.post("/lamp", validateKey, saveLampLog);
router.get("/lamp/:isPJU", getLastLampStatus);

// user
router.get("/me", authenticateToken, GetCurrentUser);
router.post("/login", LoginUser);
router.post("/register", authenticateToken, RegisterUser);
router.get("/user/list", authenticateToken, GetAllUser);
router.get("/user/:userId", authenticateToken, GetUser);
router.put("/user/:userId", authenticateToken, UpdateUser);
router.delete("/user/:userId", authenticateToken, DeleteUser);

// get api key
router.get("/api-key", authenticateToken, getApiKey);

router.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

// Route untuk RTSP stream
router.get('/cctv-stream', (req, res) => {
  const rtspUrl = process.env.RTSP_URL;

  if (!rtspUrl) {
      return res.status(400).send("RTSP URL is required");
  }

  const ffmpeg = new Ffmpeg(rtspUrl)
      .inputOptions('-rtsp_transport tcp')
      .noAudio()
      .videoCodec('mjpeg')
      .format('mjpeg')
      .on('error', (err) => {
          console.error(`Error: ${err.message}`);
          res.status(500).send("Stream error");
      });

  const mjpegReqHandler = new MjpegServer(req, res);
  ffmpeg.pipe(mjpegReqHandler);
});

module.exports = router;
