/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
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
 *         password:
 *           type: string
 *           description: The user's password, must be between 8 and 255 characters long.
 *         confirm_password:
 *           type: string
 *           description: Confirmation of the user's password, must match the password.
 *         role_code:
 *           type: string
 *           description: The role code of the user, must be a string.
 *       example:
 *         username: "yourusername123"
 *         name: "Your Name"
 *         email: "youremail@example.com"
 *         password: "yourpassword"
 *         confirm_password: "yourpassword"
 *         role_code: "admin"
 */
