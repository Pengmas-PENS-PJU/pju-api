/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - old_password
 *         - new_password
 *         - confirm_password
 *       properties:
 *         old_password:
 *           type: string
 *           description: The user's old password, required for verification.
 *         new_password:
 *           type: string
 *           description: The user's new password, must be between 8 and 255 characters long.
 *         confirm_password:
 *           type: string
 *           description: Must match with the new password.
 *       example:
 *         old_password: "oldpassword123"
 *         new_password: "newpassword123"
 *         confirm_password: "newpassword123"
 */
