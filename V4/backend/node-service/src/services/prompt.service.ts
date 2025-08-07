import { Prompt } from '@/models/prompt.model';
import { User } from '@/models/user.model';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { Op } from 'sequelize';

interface PromptFilters {
  category?: string;
  language?: string;
  tags?: string[];
}

interface PromptCreateData {
  title: string;
  prompt: string;
  description?: string;
  category: string;
  language?: string;
  tags?: string[];
  userId: number;
}

interface PromptUpdateData {
  title?: string;
  prompt?: string;
  description?: string;
  category?: string;
  language?: string;
  tags?: string[];
}

export class PromptService {
  async findAll(page: number = 1, limit: number = 10, filters: PromptFilters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.language) {
        whereClause.language = filters.language;
      }

      if (filters.tags && filters.tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: filters.tags
        };
      }

      const { rows: prompts, count: total } = await Prompt.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return { prompts, total };
    } catch (error) {
      logger.error('Find all prompts failed:', error);
      throw new CustomError('Failed to retrieve prompts', 500);
    }
  }

  async findById(id: number) {
    try {
      const prompt = await Prompt.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ]
      });

      return prompt;
    } catch (error) {
      logger.error('Find prompt by ID failed:', error);
      throw new CustomError('Failed to retrieve prompt', 500);
    }
  }

  async findByUserId(userId: number, page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Prompt.findAndCountAll({
        where: { userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        prompts: rows,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1
      };
    } catch (error) {
      logger.error('Find prompts by user ID failed:', error);
      throw new CustomError('Failed to retrieve user prompts', 500);
    }
  }

  async create(data: PromptCreateData) {
    try {
      const prompt = await Prompt.create({
        title: data.title,
        prompt: data.prompt,
        description: data.description,
        category: data.category,
        language: data.language || '',
        tags: data.tags || [],
        userId: data.userId,
        active: true,
        viewCount: 0,
        copyCount: 0
      });

      return await this.findById(prompt.id);
    } catch (error) {
      logger.error('Create prompt failed:', error);
      throw new CustomError('Failed to create prompt', 500);
    }
  }

  async update(id: number, data: PromptUpdateData) {
    try {
      const prompt = await Prompt.findByPk(id);
      
      if (!prompt) {
        throw new CustomError('Prompt not found', 404);
      }

      await prompt.update(data);
      
      return await this.findById(id);
    } catch (error) {
      logger.error('Update prompt failed:', error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to update prompt', 500);
    }
  }

  async delete(id: number) {
    try {
      const prompt = await Prompt.findByPk(id);
      
      if (!prompt) {
        throw new CustomError('Prompt not found', 404);
      }

      await prompt.destroy();
      
      return true;
    } catch (error) {
      logger.error('Delete prompt failed:', error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to delete prompt', 500);
    }
  }

  async search(query: string, page: number = 1, limit: number = 10, filters: PromptFilters = {}, sortBy: string = 'createdAt', sortOrder: string = 'desc') {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (query) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { prompt: { [Op.like]: `%${query}%` } }
        ];
      }

      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.language) {
        whereClause.language = filters.language;
      }

      if (filters.tags && filters.tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: filters.tags
        };
      }

      const validSortFields = ['title', 'createdAt', 'updatedAt', 'category'];
      const validSortOrders = ['asc', 'desc'];

      const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

      const { rows: prompts, count: total } = await Prompt.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ],
        limit,
        offset,
        order: [[orderField, orderDirection]]
      });

      return { prompts, total };
    } catch (error) {
      logger.error('Search prompts failed:', error);
      throw new CustomError('Failed to search prompts', 500);
    }
  }
}
