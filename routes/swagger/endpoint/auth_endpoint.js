/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth API
 *
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Success
 *
 * /register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     security:
 *       - AuthorizationTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Success
 * 
 * /me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - AuthorizationTokenAuth: []
 *     responses:
 *       200:
 *         description: Success
 */