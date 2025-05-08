import express from 'express';
import { protect } from '../middleware/auth';
import { workspaceService } from '../services/workspaceService';
import { UserService } from '../services/userService';

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

router.get('/:id/allMembers', protect, async (req, res, next) => {
  try {
    const members = await workspaceService.getMembersByWorkspaceId(
      req.params.id,
      req.user.id,
    );
    res.status(200).json({
      status: 'success',
      data: members
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/workspaces/{id}/members:
 *   post:
 *     summary: Add multiple members to a workspace
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
 *             required:
 *               - memberIds
 *             properties:
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of user IDs to add as members
 *     responses:
 *       200:
 *         description: Members added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *       400:
 *         description: Invalid input or members already exist
 *       404:
 *         description: Workspace not found
 */
router.post('/:id/members', protect, async (req, res, next) => {
  try {
    const members = await workspaceService.addMembers(
      req.params.id,
      req.user.id,
      req.body.memberIds
    );
    res.status(200).json({
      status: 'success',
      data: members
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/workspaces/{id}/available-users:
 *   get:
 *     summary: Get available users not in workspace with pagination
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of available users with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *       404:
 *         description: Workspace not found
 */
router.get('/:id/available-users', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await UserService.getAvailableWorkspaceUsers(
      req.params.id,
      page,
      limit
    );
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/workspaces/{id}/members/remove:
 *   post:
 *     summary: Remove multiple members from a workspace
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
 *         description: Workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberIds
 *             properties:
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of user IDs to remove
 *     responses:
 *       200:
 *         description: Members removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *       404:
 *         description: Workspace or members not found
 */
router.post('/:id/members/remove', protect, async (req, res, next) => {
  try {
    const members = await workspaceService.removeMembers(
      req.params.id,
      req.user.id,
      req.body.memberIds
    );
    res.status(200).json({
      status: 'success',
      data: members
    });
  } catch (error) {
    next(error);
  }
});

export default router;