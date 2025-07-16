import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import { CustomError } from '@/middleware/errorHandler';
import { UserService } from '@/services/user.service';
import { UserRole } from '@/types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new CustomError('No token provided', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // Verify it's an access token
    if (decoded.type !== 'access') {
      throw new CustomError('Invalid token type', 401);
    }

    // Check if user still exists and is enabled
    const userService = new UserService();
    const user = await userService.findById(decoded.id);
    
    if (!user || !user.enabled) {
      throw new CustomError('User not found or disabled', 401);
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new CustomError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError('Insufficient permissions', 403);
    }

    next();
  };
};

export const requireAdmin = authorize([UserRole.ADMIN]);
export const requireUser = authorize([UserRole.USER, UserRole.ADMIN]);
