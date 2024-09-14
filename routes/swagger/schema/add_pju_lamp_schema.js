/**
 * @swagger
 * components:
 *   schemas:
 *     PjuLampItemRequest:
 *       type: object
 *       required:
 *         - on
 *         - automated
 *         - isPJU
 *       properties:
 *         on:
 *           type: boolean
 *           description: Indicates if the PJU is on or off
 *         automated:
 *           type: boolean
 *           description: Indicates if the PJU is in automatic mode
 *         isPJU:
 *           type: boolean
 *           description: Indicates if the item is a PJU
 *       example:
 *         on: true
 *         automated: false
 *         isPJU: true
 *     AddPjuLampRequest: 
 *       type: object
 *       required:
 *         - lamp
 *       properties:
 *         lamp:
 *           type: object
 *           $ref: '#/components/schemas/PjuLampItemRequest'
 *       example:
 *          on: true
 *          automated: false
 *          isPJU: true
 */
