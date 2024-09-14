/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: The Weather Sensor API
 *
 * /weather:
 *   post:
 *     summary: Create a new weather sensor data
 *     tags: [Weather]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddWeatherRequest'
 *     responses:
 *       201:
 *         description: Created
 *
 *   get:
 *     summary: Get the latest weather sensor data
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Success
 */
