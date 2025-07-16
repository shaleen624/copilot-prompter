import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import { UserService } from '@/services/user.service';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { UserRole } from '@/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new CustomError('Access token required', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    const userService = new UserService();
    const user = await userService.findById(decoded.id);

    if (!user) {
      throw new CustomError('User not found', 401);
    }

    if (!user.enabled) {
      throw new CustomError('User account is disabled', 401);
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token attempt', { ip: req.ip, userAgent: req.get('User-Agent') });
      next(new CustomError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new CustomError('Authentication required', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new CustomError('Insufficient permissions', 403));
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      const userService = new UserService();
      const user = await userService.findById(decoded.id);

      if (user && user.enabled) {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    next();
  }
};
