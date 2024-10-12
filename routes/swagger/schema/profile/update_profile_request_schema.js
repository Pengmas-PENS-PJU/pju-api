/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username, must be alphanumeric and between 4 and 255 characters.
 *         name:
 *           type: string
 *           description: The user's name, must be a string and between 3 and 255 characters.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address, must be a valid email format.
 *       example:
 *         username: "yourusername123"
 *         name: "Your Name"
 *         email: "youremail@example.com"
 */
