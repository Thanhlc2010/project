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
 *               - projectId
 *               - name
 *               - tasks
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the project the Pert belongs to
 *               name:
 *                 type: string
 *                 description: Name of the Pert
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - issueId
 *                   properties:
 *                     issueId:
 *                       type: string
 *                       format: uuid
 *                       description: ID of the issue
 *                     parentIssueId:
 *                       type: string
 *                       format: uuid
 *                       description: ID of the parent issue (optional)
 *                     position_x:
 *                       type: number
 *                       format: float
 *                       description: X position of the task
 *                     position_y:
 *                       type: number
 *                       format: float
 *                       description: Y position of the task
 *                     ES:
 *                       type: number
 *                       format: float
 *                       description: Earliest Start time
 *                     EF:
 *                       type: number
 *                       format: float
 *                       description: Earliest Finish time
 *                     LS:
 *                       type: number
 *                       format: float
 *                       description: Latest Start time
 *                     LF:
 *                       type: number
 *                       format: float
 *                       description: Latest Finish time
 *                     data_position_x:
 *                       type: number
 *                       format: float
 *                       description: Data X position
 *                     data_position_y:
 *                       type: number
 *                       format: float
 *                       description: Data Y position
 *                     dependencies:
 *                       type: string
 *                       description: Task dependencies
 *           example:
 *             projectId: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "Project Timeline"
 *             tasks:
 *               - issueId: "954fec03-3260-45d4-99d1-42e9e786333e"
 *               - issueId: "eaaec6c3-8389-4769-8ac5-42dad08a3cf1"
 *                 parentIssueId: "954fec03-3260-45d4-99d1-42e9e786333e"
 *     responses:
 *       201:
 *         description: Pert created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Pert'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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
 *         description: List of Perts with their tasks
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
 *         description: Pert details with its tasks
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
 *               name:
 *                 type: string
 *                 description: New name for the Pert
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - issueId
 *                   properties:
 *                     issueId:
 *                       type: string
 *                       format: uuid
 *                     parentIssueId:
 *                       type: string
 *                       format: uuid
 *                     position_x:
 *                       type: number
 *                       format: float
 *                     position_y:
 *                       type: number
 *                       format: float
 *                     ES:
 *                       type: number
 *                       format: float
 *                     EF:
 *                       type: number
 *                       format: float
 *                     LS:
 *                       type: number
 *                       format: float
 *                     LF:
 *                       type: number
 *                       format: float
 *                     data_position_x:
 *                       type: number
 *                       format: float
 *                     data_position_y:
 *                       type: number
 *                       format: float
 *                     dependencies:
 *                       type: string
 *           example:
 *             name: "Updated Timeline"
 *             tasks:
 *               - issueId: "954fec03-3260-45d4-99d1-42e9e786333e"
 *               - issueId: "eaaec6c3-8389-4769-8ac5-42dad08a3cf1"
 *                 parentIssueId: "954fec03-3260-45d4-99d1-42e9e786333e"
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
 *     summary: Delete a Pert and its tasks
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
 *         description: Pert and its tasks deleted successfully
 *       404:
 *         description: Pert not found
 */
router.delete('/:id', protect, async (req, res, next) => {
    try {
        await pertService.deletePert(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Pert and its tasks deleted successfully',
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
 *         description: List of Perts with their tasks for the specified project
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
