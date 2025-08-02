import { Router } from 'express';
import { authenticate, requireUser } from '@/middleware/authenticate';

const router = Router();

// All user routes require authentication
router.use(authenticate, requireUser);

// Get user profile
router.get('/:userId', (req, res) => {
  res.json({ 
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      id: req.params.userId,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    }
  });
});

// Update user profile
router.put('/:userId', (req, res) => {
  res.json({ 
    success: true,
    message: 'User profile updated successfully',
    data: {
      id: req.params.userId,
      ...req.body
    }
  });
});

// Change password
router.post('/:userId/change-password', (_req, res) => {
  res.json({ 
    success: true,
    message: 'Password changed successfully'
  });
});

export { router as userRouter };
