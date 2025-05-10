import express from 'express';
import { protect } from '../middleware/auth';
import { UserService } from '../services/userService';
import { AppError } from '../utils/AppError';
import { environment } from '../config/environment';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or email already exists
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw AppError.validation('Email and password are required');
    }

    const { user, token } = await UserService.register({ email, password, name });
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: environment.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // to do: should use env number to control maxAge
    });
    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw AppError.validation('Email and password are required');
    }

    const { token, user } = await UserService.login({ email, password });
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: environment.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // to do: should use env number to control maxAge
    });
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put('/me', protect, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserService.updateUser(req.user.id, {
      name,
      email,
      password,
    });
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', protect, async (req, res, next) => {
  try {
    const result = await UserService.logout();
    res.clearCookie('accessToken');
    res.clearCookie('userData');
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete('/profile', protect, async (req, res, next) => {
  try {
    const result = await UserService.deleteUser(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: excludeIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         style: form
 *         explode: false
 *         description: Optional array of user IDs to exclude from results
 *     responses:
 *       200:
 *         description: List of users with pagination
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
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Handle excludeIds if provided in query
    let excludeUserIds: string[] = [];
    if (req.query.excludeIds) {
      excludeUserIds = (req.query.excludeIds as string).split(',');
    }
    
    const result = await UserService.getAllUsersWithPagination(page, limit, excludeUserIds);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
