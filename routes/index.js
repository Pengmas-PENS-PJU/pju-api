const express = require('express');
const { GetDataSensor, AddDataSensor, GetSensorTypes, AddSensorType, GetDataSensorByType, GetLatestSensorDataByType, GetSensorDataHourly } = require('../controller/sensor.js');
const { AddWeatherData, GetWeatherData, ExportWeatherData } = require('../controller/weatherSensor.js');
const { AddAirQualityData, GetAirQualityData, GetAirQualityISPU, ExportAirQualityData } = require('../controller/airQualitySensor.js');
const { AddMonitorData, GetMonitorData, ExportMonitorData } = require('../controller/monitor.js');
const { AddAll, GetAll } = require('../controller/request.js');
const { AddLampLog, saveLampLog, getLastLampStatus } = require('../controller/lamp.js');
const { LoginUser, GetCurrentUser, getApiKey, RefreshToken, LogoutUser } = require('../controller/user.js');
const { authenticateToken, validateKey } = require('../middleware/middleware.js');
const { loginValidation } = require('../validate/auth/loginValidation.js');

// Stream
const Ffmpeg = require('fluent-ffmpeg');
const MjpegServer = require('mjpeg-server');
const refreshTokenMiddleware = require('../middleware/refreshTokenMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');
const { createUserValidation } = require('../validate/user/createUserValidation.js');
const { createUserController, getUserByIdController, updateUserController, deleteUserController, getUserListController } = require('../controller/userManagementController.js');
const { updateUserValidation } = require('../validate/user/updateUserValidation.js');
const { getProfileController, updateProfileController, deleteProfileController, updatePasswordController } = require('../controller/profileController.js');
const { updateProfileValidation } = require('../validate/profile/updateProfileValidation.js');
const { updatePasswordValidation } = require('../validate/profile/updatePasswordValidation.js');
const { getHourlySensorData } = require('../services/sensor.js');

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
router.get('/weather', GetWeatherData);
router.post('/weather', validateKey, AddWeatherData);
router.get('/weather/export', ExportWeatherData) 

// air quality only
router.get('/air-quality', GetAirQualityData);
router.post('/air-quality', validateKey, AddAirQualityData);
router.get('/air-quality/:pjuId/ispu', GetAirQualityISPU);
router.get('/air-quality/export', ExportAirQualityData);

// monitor only
router.get('/monitor/:pjuId', GetMonitorData);
router.post('/monitor', validateKey, AddMonitorData);
router.get('/monitor/:pjuId/export', ExportMonitorData)

// lamp only
router.post('/lamp', validateKey, saveLampLog);
router.get('/lamp/:isPJU', getLastLampStatus);

// data all sensor
router.get('/sensor/hourly', GetSensorDataHourly);
// params example ("/sensor/hourly?sensorCode=SO2&date=2024-10-13&pjuId=2")

// user
router.get('/me', authenticateToken, GetCurrentUser);
router.post('/login', loginValidation, LoginUser);
router.post('/refresh-token', refreshTokenMiddleware, RefreshToken);
router.post('/logout', authenticateToken, LogoutUser);

router.post('/user/create', authenticateToken, roleMiddleware('admin'), createUserValidation, createUserController);
router.get('/user', authenticateToken, roleMiddleware('admin'), getUserListController);
router.get('/user/:userId', authenticateToken, roleMiddleware('admin'), getUserByIdController);
router.patch('/user/:userId/update', authenticateToken, roleMiddleware('admin'), updateUserValidation, updateUserController);
router.delete('/user/:userId/delete', authenticateToken, roleMiddleware('admin'), deleteUserController);

router.get('/profile', authenticateToken, getProfileController);
router.patch('/profile/update', authenticateToken, updateProfileValidation, updateProfileController);
router.delete('/profile/delete', authenticateToken, deleteProfileController);
router.patch('/profile/update-password', authenticateToken, updatePasswordValidation, updatePasswordController);

// get api key
router.get('/api-key', authenticateToken, getApiKey);

// Route untuk RTSP stream
// router.get('/cctv-stream', (req, res) => {
//   const rtspUrl = process.env.RTSP_URL;

//   if (!rtspUrl) {
//     return res.status(400).send('RTSP URL is required');
//   }

//   const ffmpeg = new Ffmpeg(rtspUrl)
//     .inputOptions('-rtsp_transport tcp')
//     .noAudio()
//     .videoCodec('mjpeg')
//     .format('mjpeg')
//     .on('error', (err) => {
//       console.error(`Error: ${err.message}`);
//       res.status(500).send('Stream error');
//     });

//   const mjpegReqHandler = new MjpegServer(req, res);
//   ffmpeg.pipe(mjpegReqHandler);
// });

module.exports = router;

//
