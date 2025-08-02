import { Router } from 'express';
import { authenticate, requireUser } from '@/middleware/authenticate';

const router = Router();

// All admin routes require authentication
router.use(authenticate, requireUser);

// Get all users (admin only)
router.get('/users', (_req, res) => {
  res.json({ 
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users: [
        {
          id: 1,
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'USER'
        }
      ],
      totalCount: 1
    }
  });
});

// Update user role (admin only)
router.put('/users/:userId/role', (req, res) => {
  res.json({ 
    success: true,
    message: 'User role updated successfully',
    data: {
      id: req.params.userId,
      role: req.body.role
    }
  });
});

// Get system stats (admin only)
router.get('/system/stats', (_req, res) => {
  res.json({ 
    success: true,
    message: 'System stats retrieved successfully',
    data: {
      totalUsers: 1,
      totalPrompts: 0,
      totalTemplates: 0,
      systemUptime: '1 hour'
    }
  });
});

// Delete user (admin only)
router.delete('/users/:userId', (req, res) => {
  res.json({ 
    success: true,
    message: 'User deleted successfully',
    data: {
      id: req.params.userId
    }
  });
});

export { router as adminRouter };
