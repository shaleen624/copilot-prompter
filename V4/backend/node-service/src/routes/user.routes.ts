import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (_req, res) => {
  res.json({ message: 'User routes' });
});

export { router as userRouter };
