import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body } from 'express-validator';

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        res.status(400).json({
          success: false,
          message: `Validation failed: ${errorMessages}`,
          errors: errors.array()
        });
        return;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Template validation functions
export const validateTemplate = validateRequest([
  body('name')
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters')
    .trim(),
  
  body('category')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim(),
  
  body('language')
    .isLength({ min: 1, max: 30 })
    .withMessage('Language must be between 1 and 30 characters')
    .trim(),
  
  body('framework')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Framework must be less than 30 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),
  
  body('content')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    })
]);

export const validateTemplateUpdate = validateRequest([
  body('name')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters')
    .trim(),
  
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim(),
  
  body('language')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('Language must be between 1 and 30 characters')
    .trim(),
  
  body('framework')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Framework must be less than 30 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),
  
  body('content')
    .optional()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    })
]);
