import express from 'express';
import { protect } from '../middleware/auth';
import { projectService } from '../services/projectService';

const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
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
 *               - workspaceId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.user.id, {
      name: req.body.name,
      description: req.body.description,
      workspaceId: req.body.workspaceId,
    });
    res.status(201).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter projects by workspace ID
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const projects = await projectService.getProjects(req.user.id, req.query.workspaceId as string);
    res.status(200).json({
      status: 'success',
      data: projects,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
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
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
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
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user.id, {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
    });
    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);
    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/projects/{id}/members:
 *   post:
 *     summary: Add a member to a project
 *     tags: [Projects]
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Member added successfully
 *       404:
 *         description: Project or user not found
 */
router.post('/:id/members', protect, async (req, res, next) => {
  try {
    const member = await projectService.addMember(req.params.id, req.user.id, req.body.userId);
    res.status(200).json({
      status: 'success',
      data: member,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
