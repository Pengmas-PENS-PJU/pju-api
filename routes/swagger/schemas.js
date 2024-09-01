/**
 * @swagger
 * components:
 *   schemas:
 *     SensorItemRequest:
 *       type: object
 *       required:
 *         - value
 *         - sensorCode
 *       properties:
 *         value:
 *           type: number
 *           format: float
 *           description: The value of the sensor data
 *         sensorCode:
 *           type: string
 *           description: The sensor type code
 *       example:
 *         value: 45.2
 *         sensorCode: HUM
 *     CreateSensorAndPjuRequest:
 *       type: object
 *       properties:
 *         sensor:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SensorItemRequest'
 *           description: Array of sensor data items
 *           example:
 *             - value: 45.2
 *               sensorCode: HUM
 *             - value: 27.1
 *               sensorCode: TEMP
 *             - value: 512
 *               sensorCode: SOLAR
 *             - value: 2
 *               sensorCode: RAIN
 *             - value: 120.5
 *               sensorCode: WATER
 *             - value: 15
 *               sensorCode: WINDSPD
 *             - value: 270
 *               sensorCode: WINDDIR
 *             - value: 0.04
 *               sensorCode: CO
 *             - value: 0.02
 *               sensorCode: NO2
 *             - value: 0.05
 *               sensorCode: O3
 *             - value: 12.5
 *               sensorCode: PM
 *             - value: 60
 *               sensorCode: SO2
 *         pju:
 *           type: object
 *           $ref: '#/components/schemas/PjuDataRequest'
 *           description: The PJU data
 *     PjuDataRequest:
 *       type: object
 *       required:
 *         - monitor
 *         - lamp
 *       properties:
 *         monitor:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PjuMonitorItemRequest'
 *         lamp:
 *           type: object
 *           $ref: '#/components/schemas/PjuLampItemRequest'
 *       example:
 *         monitor:
 *           - value: 6
 *             attributeCode: VOLT
 *           - value: 3
 *             attributeCode: CURR
 *           - value: 500
 *             attributeCode: POW
 *           - value: 0.95
 *             attributeCode: COSPHI
 *           - value: 27
 *             attributeCode: TEMP
 *           - value: 50
 *             attributeCode: FREQ
 *           - value: 800
 *             attributeCode: LUM
 *         lamp:
 *           on: true
 *           brightness: 75
 *           automated: false
 *           isPJU: true
 *     PjuMonitorItemRequest:
 *       type: object
 *       required:
 *         - value
 *         - attributeCode
 *       properties:
 *         value:
 *           type: number
 *           format: float
 *           description: The value of the monitor data
 *         attributeCode:
 *           type: string
 *           description: The monitor attribute code
 *       example:
 *         value: 6
 *         attributeCode: VOLT
 *     PjuLampItemRequest:
 *       type: object
 *       required:
 *         - on
 *         - brightness
 *         - automated
 *         - isPJU
 *       properties:
 *         on:
 *           type: boolean
 *           description: Indicates if the PJU is on or off
 *         brightness:
 *           type: number
 *           description: The brightness level of the PJU
 *         automated:
 *           type: boolean
 *           description: Indicates if the PJU is in automatic mode
 *         isPJU:
 *           type: boolean
 *           description: Indicates if the item is a PJU
 *       example:
 *         on: true
 *         brightness: 75
 *         automated: false
 *         isPJU: true
 */
