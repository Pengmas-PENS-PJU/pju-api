/**
 * @swagger
 * tags:
 *   name: AirQuality
 *   description: The Air Quality Sensor API
 *
 * /air-quality:
 *   post:
 *     summary: Create a new Air Quality sensor data
 *     tags: [AirQuality]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddAirQualityRequest'
 *     responses:
 *       201:
 *         description: Created
 *
 *   get:
 *     summary: Get the latest Air Quality sensor data
 *     tags: [AirQuality]
 *     responses:
 *       200:
 *         description: Success
 *   
 * /air-quality/{pjuId}/ispu:
 *   get:
 *     summary: Get Air Quality conclusion in one day
 *     tags: [AirQuality]
 *     parameters:
 *       - in: path
 *         name: pjuId
 *         required: true
 *         schema:
 *           type: number
 *         description: PJU ID to filter the data
 *     responses:
 *       200:
 *         description: Success
 */
