import { Request, Response, NextFunction } from 'express';
import { PromptService } from '@/services/prompt.service';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class PromptController {
  private promptService: PromptService;

  constructor() {
    this.promptService = new PromptService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const language = req.query.language as string;
      const tags = req.query.tags as string;

      const filters = {
        category,
        language,
        tags: tags ? tags.split(',') : undefined
      };

      const result = await this.promptService.findAll(page, limit, filters);

      res.status(200).json({
        success: true,
        message: 'Prompts retrieved successfully',
        data: result.prompts,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      logger.error('Get all prompts failed:', error);
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw new CustomError('Invalid prompt ID', 400);
      }

      const prompt = await this.promptService.findById(id);

      if (!prompt) {
        throw new CustomError('Prompt not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Prompt retrieved successfully',
        data: prompt
      });
    } catch (error) {
      logger.error('Get prompt by ID failed:', error);
      next(error);
    }
  };

  getByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        throw new CustomError('Invalid user ID', 400);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.promptService.findByUserId(userId, page, limit);

      res.status(200).json({
        success: true,
        message: 'User prompts retrieved successfully',
        data: result
      });
    } catch (error) {
      logger.error('Get prompts by user ID failed:', error);
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const promptData = {
        ...req.body,
        author: req.user?.username  // Use username instead of ID
      };

      const prompt = await this.promptService.create(promptData);

      res.status(201).json({
        success: true,
        message: 'Prompt created successfully',
        data: prompt
      });
    } catch (error) {
      logger.error('Create prompt failed:', error);
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw new CustomError('Invalid prompt ID', 400);
      }

      const existingPrompt = await this.promptService.findById(id);
      
      if (!existingPrompt) {
        throw new CustomError('Prompt not found', 404);
      }

      // Check if user owns the prompt or is admin
      const promptAuthor = existingPrompt.author || existingPrompt.getDataValue('author');
      if (promptAuthor !== req.user?.username && req.user?.role !== 'ADMIN') {
        throw new CustomError('Not authorized to update this prompt', 403);
      }

      const updatedPrompt = await this.promptService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Prompt updated successfully',
        data: updatedPrompt
      });
    } catch (error) {
      logger.error('Update prompt failed:', error);
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw new CustomError('Invalid prompt ID', 400);
      }

      const existingPrompt = await this.promptService.findById(id);
      
      if (!existingPrompt) {
        throw new CustomError('Prompt not found', 404);
      }

      // Check if user owns the prompt or is admin
      const promptAuthor = existingPrompt.author || existingPrompt.getDataValue('author');
      if (promptAuthor !== req.user?.username && req.user?.role !== 'ADMIN') {
        throw new CustomError('Not authorized to delete this prompt', 403);
      }

      await this.promptService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Prompt deleted successfully'
      });
    } catch (error) {
      logger.error('Delete prompt failed:', error);
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const language = req.query.language as string;
      const tags = req.query.tags as string;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'desc';

      const filters = {
        category,
        language,
        tags: tags ? tags.split(',') : undefined
      };

      const result = await this.promptService.search(query, page, limit, filters, sortBy, sortOrder);

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: result.prompts,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      logger.error('Search prompts failed:', error);
      next(error);
    }
  };
}
