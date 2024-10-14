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
 * /monitor/{pjuId}:
 *   get:
 *     summary: Get the latest PJU Monitor data
 *     tags: [PjuMonitor]
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
