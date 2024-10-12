/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username_email
 *         - password
 *       properties:
 *         username_email:
 *           type: string
 *           description: The user's username or email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         username_email: "yourusername123"
 *         password: "yourpassword"
 */
