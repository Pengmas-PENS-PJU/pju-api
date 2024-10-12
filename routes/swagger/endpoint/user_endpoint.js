/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User Management API
 *
 * /user:
 *   get:
 *     summary: Get user list
 *     tags: [User]
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /user/create:
 *   post:
 *     summary: Create user
 *     tags: [User]
 *     security:
 *       - AccessTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Created
 * 
 * /user/{userId}:
 *   get:
 *     summary: Get single user
 *     tags: [User]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 * 
 * /user/{userId}/update:
 *   patch:
 *     summary: Update user
 *     tags: [User]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Success
 * 
 * /user/{userId}/delete:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *
 */
