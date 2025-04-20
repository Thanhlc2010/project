import express from 'express';
import { protect } from '../middleware/auth';
import { issueService } from '../services/issueService';
import { IssueStatus, Priority } from '@prisma/client';

const router = express.Router();

/**
 * @swagger
 * /api/issues:
 *   post:
 *     summary: Create a new issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: string
 *                 format: uuid
 *               assigneeId:
 *                 type: string
 *                 format: uuid
 *               priority:
 *                 type: string
 *                 enum: [LOWEST, LOW, MEDIUM, HIGH, HIGHEST]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               parentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Issue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       400:
 *         description: Invalid input
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const issue = await issueService.createIssue(req.user.id, {
      title: req.body.title,
      description: req.body.description,
      projectId: req.body.projectId,
      assigneeId: req.body.assigneeId,
      priority: req.body.priority,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      parentId: req.body.parentId
    });
    res.status(201).json({
      status: 'success',
      data: issue
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/issues:
 *   get:
 *     summary: Get all issues
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter issues by project ID
 *       - in: query
 *         name: assigneeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter issues by assignee ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, IN_REVIEW, DONE]
 *         description: Filter issues by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOWEST, LOW, MEDIUM, HIGH, HIGHEST]
 *         description: Filter issues by priority
 *     responses:
 *       200:
 *         description: List of issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issue'
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const issues = await issueService.getIssues(req.user.id, {
      projectId: req.query.projectId as string,
      assigneeId: req.query.assigneeId as string,
      status: req.query.status as IssueStatus,
      priority: req.query.priority as Priority
    });
    res.status(200).json({
      status: 'success',
      data: issues
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/issues/{id}:
 *   get:
 *     summary: Get an issue by ID
 *     tags: [Issues]
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
 *         description: Issue details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       404:
 *         description: Issue not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const issue = await issueService.getIssueById(req.params.id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: issue
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/issues/{id}:
 *   put:
 *     summary: Update an issue
 *     tags: [Issues]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assigneeId:
 *                 type: string
 *                 format: uuid
 *               priority:
 *                 type: string
 *                 enum: [LOWEST, LOW, MEDIUM, HIGH, HIGHEST]
 *               issueStatus:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, IN_REVIEW, DONE]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       404:
 *         description: Issue not found
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    const issue = await issueService.updateIssue(req.params.id, req.user.id, {
      title: req.body.title,
      description: req.body.description,
      assigneeId: req.body.assigneeId,
      priority: req.body.priority,
      issueStatus: req.body.issueStatus,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined
    });
    res.status(200).json({
      status: 'success',
      data: issue
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/issues/{id}/comments:
 *   post:
 *     summary: Add a comment to an issue
 *     tags: [Issues]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Issue not found
 */
router.post('/:id/comments', protect, async (req, res, next) => {
  try {
    const comment = await issueService.addComment(req.params.id, req.user.id, req.body.content);
    res.status(201).json({
      status: 'success',
      data: comment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/issues/{id}/labels:
 *   post:
 *     summary: Add a label to an issue
 *     tags: [Issues]
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
 *               - labelId
 *             properties:
 *               labelId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Label added successfully
 *       404:
 *         description: Issue or label not found
 */
router.post('/:id/labels', protect, async (req, res, next) => {
  try {
    const label = await issueService.addLabel(req.params.id, req.user.id, req.body.labelId);
    res.status(200).json({
      status: 'success',
      data: label
    });
  } catch (error) {
    next(error);
  }
});

export default router;