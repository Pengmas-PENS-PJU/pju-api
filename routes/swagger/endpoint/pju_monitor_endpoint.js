/**
 * @swagger
 * tags:
 *   name: PjuMonitor
 *   description: The PJUMonitor Sensor API
 *
 * /monitor:
 *   post:
 *     summary: Create a new PJU Monitor data
 *     tags: [PjuMonitor]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPjuMonitorRequest'
 *     responses:
 *       201:
 *         description: Created
 *
 *   get:
 *     summary: Get the latest PJU Monitor data
 *     tags: [PjuMonitor]
 *     responses:
 *       200:
 *         description: Success
 */
