import express from 'express';
import { protect } from '../middleware/auth';
import { pertService } from '../services/pertService';

const router = express.Router();

/**
* @swagger
* /api/perts:
*   post:
*     summary: Create a new Pert
*     tags: [Perts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - taskNodes
*               - taskEdges
*             properties:
*               taskNodes:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/TaskNode'
*               taskEdges:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/TaskEdge'
*           example:
*             taskNodes:
*               - type: "string"
*                 position_x: 0
*                 position_y: 0
*                 name: "string"
*                 duration: 0
*                 priority: "string"
*                 ES: 0
*                 EF: 0
*                 LS: 0
*                 LF: 0
*                 data_position_x: 0
*                 data_position_y: 0
*                 dependencies: "string"
*             taskEdges:
*               - source: "954fec03-3260-45d4-99d1-42e9e786333e"
*                 target: "eaaec6c3-8389-4769-8ac5-42dad08a3cf1"
*             projectId: "string"
*     responses:
*       201:
*         description: Pert created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Pert'
*/
router.post('/', protect, async (req, res, next) => {
    try {
        const pert = await pertService.createPert(req.body);
        res.status(201).json({
            status: 'success',
            data: pert,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/perts:
 *   get:
 *     summary: Get all Perts
 *     tags: [Perts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Perts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pert'
 */
router.get('/', protect, async (req, res, next) => {
    try {
        const perts = await pertService.getPerts();
        res.status(200).json({
            status: 'success',
            data: perts,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/perts/{id}:
 *   get:
 *     summary: Get a Pert by ID
 *     tags: [Perts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pert details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pert'
 *       404:
 *         description: Pert not found
 */
router.get('/:id', protect, async (req, res, next) => {
    try {
        const pert = await pertService.getPertById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: pert,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/perts/{id}:
 *   put:
 *     summary: Update a Pert
 *     tags: [Perts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskNodes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TaskNode'
 *               taskEdges:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TaskEdge'
 *     responses:
 *       200:
 *         description: Pert updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pert'
 *       404:
 *         description: Pert not found
 */
router.put('/:id', protect, async (req, res, next) => {
    try {
        const pert = await pertService.updatePert(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: pert,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/perts/{id}:
 *   delete:
 *     summary: Delete a Pert
 *     tags: [Perts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pert deleted successfully
 *       404:
 *         description: Pert not found
 */
router.delete('/:id', protect, async (req, res, next) => {
    try {
        await pertService.deletePert(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Pert deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/perts/project/{projectId}:
 *   get:
 *     summary: Get Perts by Project ID
 *     tags: [Perts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of Perts for the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pert'
 *       404:
 *         description: No Perts found for the project
 */
router.get('/project/:projectId', protect, async (req, res, next) => {
    try {
        const perts = await pertService.getPertsByProjectId(req.params.projectId);
        res.status(200).json({
            status: 'success',
            data: perts,
        });
    } catch (error) {
        next(error);
    }
});
export default router;