import { body } from 'express-validator';

export const authValidation = {
  register: [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('firstName')
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters')
      .trim(),
    
    body('lastName')
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters')
      .trim()
  ],

  login: [
    body('username')
      .notEmpty()
      .withMessage('Username or email is required')
      .trim(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  refresh: [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
  ]
};

export const promptValidation = {
  create: [
    body('title')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters')
      .trim(),
    
    body('prompt')
      .isLength({ min: 1, max: 5000 })
      .withMessage('Prompt must be between 1 and 5000 characters')
      .trim(),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters')
      .trim(),
    
    body('category')
      .isLength({ min: 1, max: 50 })
      .withMessage('Category must be between 1 and 50 characters')
      .trim(),
    
    body('language')
      .optional()
      .isLength({ max: 30 })
      .withMessage('Language must be less than 30 characters')
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
  ],

  update: [
    body('title')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters')
      .trim(),
    
    body('prompt')
      .optional()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Prompt must be between 1 and 5000 characters')
      .trim(),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters')
      .trim(),
    
    body('category')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Category must be between 1 and 50 characters')
      .trim(),
    
    body('language')
      .optional()
      .isLength({ max: 30 })
      .withMessage('Language must be less than 30 characters')
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
  ]
};

export const templateValidation = {
  create: [
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
  ],

  update: [
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
  ]
};
