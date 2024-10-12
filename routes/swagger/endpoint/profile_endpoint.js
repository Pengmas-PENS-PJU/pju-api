/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: The User Profile Management API
 *
 * /profile:
 *   get:
 *     summary: Get user profile/account
 *     tags: [Profile]
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /profile/update:
 *   patch:
 *     summary: Update user profile/account
 *     tags: [Profile]
 *     security:
 *       - AccessTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Success
 * 
 * /profile/update-password:
 *   patch:
 *     summary: Update current profile/account password
 *     tags: [Profile]
 *     security:
 *       - AccessTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Success
 * 
 * /profile/delete:
 *   delete:
 *     summary: Delete user profile
 *     tags: [Profile]
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 */
