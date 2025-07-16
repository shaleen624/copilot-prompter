import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (_req, res) => {
  res.json({ message: 'Admin routes' });
});

export { router as adminRouter };
