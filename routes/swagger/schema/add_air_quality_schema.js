/**
 * @swagger
 * components:
 *   schemas:
 *     AddAirQualityRequest:
 *       type: object
 *       properties:
 *         sensor:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SensorItemRequest'
 *           description: Array of air quality sensor data items
 *           example:
 *             - sensorCode: "SO2"
 *               value: 0.00
 *             - sensorCode: "CO2"
 *               value: 941.00
 *             - sensorCode: "O2"
 *               value: 20.00
 *             - sensorCode: "PM2.5"
 *               value: 8.00
 *             - sensorCode: "PM10"
 *               value: 14.00
 *             - sensorCode: "O3"
 *               value: 0.00
 *             - sensorCode: "NO2"
 *               value: 0.00
 */
