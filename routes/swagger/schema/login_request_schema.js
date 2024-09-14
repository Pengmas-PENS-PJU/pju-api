/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         email: "youremail@gmail.com"
 *         password: "yourpassword"
 */
