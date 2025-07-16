import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { authenticate, authorize } from '@/middleware/authenticate';
import { validateTemplate, validateTemplateUpdate } from '@/middleware/validation';
import { UserRole } from '@/types/index';

const router = Router();
const templateController = new TemplateController();

// Public routes
router.get('/', templateController.getAll);
router.get('/search', templateController.search);
router.get('/:id', templateController.getById);

// Protected routes (require authentication)
router.use(authenticate);

// User routes (authenticated users)
router.post('/', authorize([UserRole.USER, UserRole.ADMIN]), validateTemplate, templateController.create);
router.put('/:id', authorize([UserRole.USER, UserRole.ADMIN]), validateTemplateUpdate, templateController.update);
router.delete('/:id', authorize([UserRole.USER, UserRole.ADMIN]), templateController.delete);

export { router as templateRouter };
