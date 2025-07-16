import { Router } from 'express';
import { PromptController } from '@/controllers/prompt.controller';
import { authenticate, requireUser } from '@/middleware/authenticate';
import { validateRequest } from '@/middleware/validation';
import { promptValidation } from '@/middleware/authValidation';

const router = Router();
const promptController = new PromptController();

/**
 * @swagger
 * /api/prompts:
 *   get:
 *     summary: Get all prompts
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated)
 *     responses:
 *       200:
 *         description: Prompts retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, requireUser, promptController.getAll);

/**
 * @swagger
 * /api/prompts/search:
 *   get:
 *     summary: Search prompts
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: Sort order (asc/desc)
 *     responses:
 *       200:
 *         description: Search completed successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authenticate, requireUser, promptController.search);

/**
 * @swagger
 * /api/prompts/{id}:
 *   get:
 *     summary: Get prompt by ID
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prompt ID
 *     responses:
 *       200:
 *         description: Prompt retrieved successfully
 *       404:
 *         description: Prompt not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, requireUser, promptController.getById);

/**
 * @swagger
 * /api/prompts:
 *   post:
 *     summary: Create a new prompt
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               prompt:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               language:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Prompt created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, requireUser, validateRequest(promptValidation.create), promptController.create);

/**
 * @swagger
 * /api/prompts/{id}:
 *   put:
 *     summary: Update prompt
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prompt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               prompt:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               language:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Prompt updated successfully
 *       404:
 *         description: Prompt not found
 *       403:
 *         description: Not authorized
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, requireUser, validateRequest(promptValidation.update), promptController.update);

/**
 * @swagger
 * /api/prompts/{id}:
 *   delete:
 *     summary: Delete prompt
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prompt ID
 *     responses:
 *       200:
 *         description: Prompt deleted successfully
 *       404:
 *         description: Prompt not found
 *       403:
 *         description: Not authorized
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, requireUser, promptController.delete);

export { router as promptRouter };
