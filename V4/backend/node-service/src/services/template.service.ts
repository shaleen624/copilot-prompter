import { CopilotTemplate } from '@/models/template.model';
// import { User } from '@/models/user.model'; // TODO: Re-enable when associations are fixed
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { Op } from 'sequelize';

interface TemplateFilters {
  category?: string;
  language?: string;
  framework?: string;
  tags?: string[];
}

interface TemplateCreateData {
  name: string;
  category: string;
  language: string;
  framework?: string;
  description?: string;
  content: string;
  tags?: string[];
  userId: string;
}

interface TemplateUpdateData {
  name?: string;
  category?: string;
  language?: string;
  framework?: string;
  description?: string;
  content?: string;
  tags?: string[];
}

export class TemplateService {
  async findAll(page: number = 1, limit: number = 10, filters: TemplateFilters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.language) {
        whereClause.language = filters.language;
      }

      if (filters.framework) {
        whereClause.framework = filters.framework;
      }

      if (filters.tags && filters.tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: filters.tags
        };
      }

      const { rows: templates, count: total } = await CopilotTemplate.findAndCountAll({
        where: whereClause,
        // TODO: Re-enable user association when userId is converted to integer
        // include: [
        //   {
        //     model: User,
        //     as: 'user',
        //     attributes: ['id', 'username', 'firstName', 'lastName']
        //   }
        // ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return { templates, total };
    } catch (error) {
      logger.error('Find all templates failed:', error);
      throw new CustomError('Failed to retrieve templates', 500);
    }
  }

  async findById(id: number) {
    try {
      const template = await CopilotTemplate.findByPk(id, {
        // TODO: Re-enable user association when userId is converted to integer
        // include: [
        //   {
        //     model: User,
        //     as: 'user',
        //     attributes: ['id', 'username', 'firstName', 'lastName']
        //   }
        // ]
      });

      return template;
    } catch (error) {
      logger.error('Find template by ID failed:', error);
      throw new CustomError('Failed to retrieve template', 500);
    }
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await CopilotTemplate.findAndCountAll({
        where: { userId },
        // TODO: Re-enable user association when userId is converted to integer
        // include: [
        //   {
        //     model: User,
        //     as: 'user',
        //     attributes: ['id', 'username', 'firstName', 'lastName']
        //   }
        // ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        templates: rows,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1
      };
    } catch (error) {
      logger.error('Find templates by user ID failed:', error);
      throw new CustomError('Failed to retrieve user templates', 500);
    }
  }

  async create(data: TemplateCreateData) {
    try {
      const template = await CopilotTemplate.create({
        name: data.name,
        category: data.category,
        language: data.language,
        framework: data.framework || '',
        description: data.description,
        content: data.content,
        tags: data.tags || [],
        userId: data.userId,
        active: true,
        viewCount: 0,
        downloadCount: 0,
        popularity: 0
      });

      return await this.findById(template.id);
    } catch (error) {
      logger.error('Create template failed:', error);
      throw new CustomError('Failed to create template', 500);
    }
  }

  async update(id: number, data: TemplateUpdateData) {
    try {
      const template = await CopilotTemplate.findByPk(id);
      
      if (!template) {
        throw new CustomError('Template not found', 404);
      }

      await template.update(data);
      
      return await this.findById(id);
    } catch (error) {
      logger.error('Update template failed:', error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to update template', 500);
    }
  }

  async delete(id: number) {
    try {
      const template = await CopilotTemplate.findByPk(id);
      
      if (!template) {
        throw new CustomError('Template not found', 404);
      }

      await template.destroy();
      
      return true;
    } catch (error) {
      logger.error('Delete template failed:', error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to delete template', 500);
    }
  }

  async search(query: string, page: number = 1, limit: number = 10, filters: TemplateFilters = {}, sortBy: string = 'createdAt', sortOrder: string = 'desc') {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (query) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } }
        ];
      }

      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.language) {
        whereClause.language = filters.language;
      }

      if (filters.framework) {
        whereClause.framework = filters.framework;
      }

      if (filters.tags && filters.tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: filters.tags
        };
      }

      const validSortFields = ['name', 'createdAt', 'updatedAt', 'category', 'popularity'];
      const validSortOrders = ['asc', 'desc'];

      const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

      const { rows: templates, count: total } = await CopilotTemplate.findAndCountAll({
        where: whereClause,
        // TODO: Re-enable user association when userId is converted to integer
        // include: [
        //   {
        //     model: User,
        //     as: 'user',
        //     attributes: ['id', 'username', 'firstName', 'lastName']
        //   }
        // ],
        limit,
        offset,
        order: [[orderField, orderDirection]]
      });

      return { templates, total };
    } catch (error) {
      logger.error('Search templates failed:', error);
      throw new CustomError('Failed to search templates', 500);
    }
  }
}
