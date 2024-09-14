/**
 * @swagger
 * components:
 *   schemas:
 *     SensorItemRequest:
 *       type: object
 *       required:
 *         - sensorCode
 *         - value
 *       properties:
 *         sensorCode:
 *           type: string
 *           description: The sensor type code
 *         value:
 *           type: number
 *           format: float
 *           description: The value of the sensor data
 *       example:
 *         sensorCode: HUM
 *         value: 45.2
 *     AddWeatherRequest:
 *       type: object
 *       properties:
 *         sensor:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SensorItemRequest'
 *           description: Array of weather sensor data items
 *           example:
 *             - sensorCode: TEMP
 *               value: 24.00
 *             - sensorCode: HUM
 *               value: 54.10
 *             - sensorCode: SOLAR
 *               value: 2.40
 *             - sensorCode: RAINFL
 *               value: 6.00
 *             - sensorCode: PRESS
 *               value: 1009.40
 *             - sensorCode: WINDSPD
 *               value: 8.00  
 *             - sensorCode: WINDDIR
 *               value: 273.00
 */
