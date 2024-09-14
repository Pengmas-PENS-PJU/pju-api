/**
 * @swagger
 * tags:
 *   name: PjuLamp
 *   description: The PJULamp Sensor API
 *
 * /lamp:
 *   post:
 *     summary: Create a new PJU Lamp data
 *     tags: [PjuLamp]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPjuLampRequest'
 *     responses:
 *       201:
 *         description: Created
 *
 * /lamp/{isPJU}:
 *   get:
 *     summary: Get the latest PJU Lamp data based on isPJU parameter
 *     tags: [PjuLamp]
 *     parameters:
 *       - in: path
 *         name: isPJU
 *         required: true
 *         schema:
 *           type: boolean
 *         description: Boolean to filter whether it is PJU data or not
 *     responses:
 *       200:
 *         description: Success
 */
