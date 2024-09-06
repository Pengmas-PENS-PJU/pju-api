/**
 * @swagger
 * tags:
 *   name: Sensor and PJU
 *   description: The sensor and PJU managing API
 * /data/all:
 *   post:
 *     summary: Create a new sensor and pju data
 *     tags: [Sensor and PJU]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSensorAndPjuRequest'
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: Get the latest sensor and pju data
 *     tags: [Sensor and PJU]
 *     responses:
 *       200:
 *         description: Success
 *
 */