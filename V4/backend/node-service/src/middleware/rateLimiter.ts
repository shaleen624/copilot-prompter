import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';

const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: config.rateLimit.maxRequests,
  duration: config.rateLimit.windowMs / 1000, // Convert to seconds
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await rateLimiter.consume(req.ip || 'unknown');
    next();
  } catch (rejRes: any) {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    
    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000),
      timestamp: new Date().toISOString(),
    });
  }
};

export { rateLimiterMiddleware as rateLimiter };
