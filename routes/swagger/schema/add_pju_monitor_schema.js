/**
 * @swagger
 * components:
 *   schemas:
 *     PjuMonitorItemRequest:
 *       type: object
 *       required:
 *         - attributeCode
 *         - value
 *       properties:
 *         attributeCode:
 *           type: string
 *           description: The monitor attribute code
 *         value:
 *           type: number
 *           format: float
 *           description: The value of the monitor data
 *       example:
 *         attributeCode: VOLT
 *         value: 6
 *     AddPjuMonitorRequest: 
 *       type: object
 *       required:
 *         - monitor
 *       properties:
 *         monitor:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PjuMonitorItemRequest'
 *           example:  
 *            - attributeCode: VOLT
 *              value: 12
 *            - attributeCode: CURR
 *              value: 3
 *            - attributeCode: POW
 *              value: 3
 *            - attributeCode: TEMP
 *              value: 40
 *            - attributeCode: LUM
 *              value: 90
 */
