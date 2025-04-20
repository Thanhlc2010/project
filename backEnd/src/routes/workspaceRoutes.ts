import express from 'express';
import { protect } from '../middleware/auth';
import { workspaceService } from '../services/workspaceService';

const router = express.Router();

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.user.id, {
      name: req.body.name
    });
    res.status(201).json({
      status: 'success',
      data: workspace
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/workspaces:
 *   get:
 *     summary: Get all workspaces for the authenticated user
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workspace'
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getWorkspaces(req.user.id);
    res.status(200).json({
      status: 'success',
      data: workspaces
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/workspaces/{id}:
 *   get:
 *     summary: Get a workspace by ID
 *     tags: [Workspaces]
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
 *         description: Workspace details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       404:
 *         description: Workspace not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: workspace
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/workspaces/{id}:
 *   put:
 *     summary: Update a workspace
 *     tags: [Workspaces]
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
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       404:
 *         description: Workspace not found
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    const workspace = await workspaceService.updateWorkspace(req.params.id, req.user.id, {
      name: req.body.name,
      status: req.body.status
    });
    res.status(200).json({
      status: 'success',
      data: workspace
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/workspaces/{id}:
 *   delete:
 *     summary: Delete a workspace
 *     tags: [Workspaces]
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
 *         description: Workspace deleted successfully
 *       404:
 *         description: Workspace not found
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await workspaceService.deleteWorkspace(req.params.id, req.user.id);
    res.status(200).json({
      status: 'success',
      message: 'Workspace deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;