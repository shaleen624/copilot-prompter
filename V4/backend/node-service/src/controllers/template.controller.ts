import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '../services/template.service';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const language = req.query.language as string;
      const framework = req.query.framework as string;
      const tags = req.query.tags as string;

      const filters = {
        category,
        language,
        framework,
        tags: tags ? tags.split(',') : undefined
      };

      const result = await this.templateService.findAll(page, limit, filters);

      res.status(200).json({
        success: true,
        message: 'Templates retrieved successfully',
        data: result.templates,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      logger.error('Get all templates failed:', error);
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw new CustomError('Invalid template ID', 400);
      }

      const template = await this.templateService.findById(id);

      if (!template) {
        throw new CustomError('Template not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Template retrieved successfully',
        data: template
      });
    } catch (error) {
      logger.error('Get template by ID failed:', error);
      next(error);
    }
  };

  getByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        throw new CustomError('Invalid user ID', 400);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.templateService.findByUserId(userId, page, limit);

      res.status(200).json({
        success: true,
        message: 'User templates retrieved successfully',
        data: result
      });
    } catch (error) {
      logger.error('Get templates by user ID failed:', error);
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const templateData = {
        ...req.body,
        userId: req.user?.id.toString()
      };

      const template = await this.templateService.create(templateData);

      res.status(201).json({
        success: true,
        message: 'Template created successfully',
        data: template
      });
    } catch (error) {
      logger.error('Create template failed:', error);
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw new CustomError('Invalid template ID', 400);
      }

      const existingTemplate = await this.templateService.findById(id);
      
      if (!existingTemplate) {
        throw new CustomError('Template not found', 404);
      }

      // Check if user owns the template or is admin
      if (existingTemplate.userId !== req.user?.id.toString() && req.user?.role !== 'ADMIN') {
        throw new CustomError('Not authorized to update this template', 403);
      }

      const updatedTemplate = await this.templateService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Template updated successfully',
        data: updatedTemplate
      });
    } catch (error) {
      logger.error('Update template failed:', error);
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw new CustomError('Invalid template ID', 400);
      }

      const existingTemplate = await this.templateService.findById(id);
      
      if (!existingTemplate) {
        throw new CustomError('Template not found', 404);
      }

      // Check if user owns the template or is admin
      if (existingTemplate.userId !== req.user?.id.toString() && req.user?.role !== 'ADMIN') {
        throw new CustomError('Not authorized to delete this template', 403);
      }

      await this.templateService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      logger.error('Delete template failed:', error);
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
      const framework = req.query.framework as string;
      const tags = req.query.tags as string;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'desc';

      const filters = {
        category,
        language,
        framework,
        tags: tags ? tags.split(',') : undefined
      };

      const result = await this.templateService.search(query, page, limit, filters, sortBy, sortOrder);

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: result.templates,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      logger.error('Search templates failed:', error);
      next(error);
    }
  };
}
