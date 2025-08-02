import { Prompt } from '@/models/prompt.model';
import { User } from '@/models/user.model';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { Op } from 'sequelize';

interface PromptFilters {
  category?: string;
  language?: string;
}

interface PromptCreateData {
  title: string;
  prompt: string;
  description?: string;
  category: string;
  language?: string;
  author: string;  // Username, not user ID
}

interface PromptUpdateData {
  title?: string;
  prompt?: string;
  description?: string;
  category?: string;
  language?: string;
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

      const { rows: prompts, count: total } = await Prompt.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['created_at', 'DESC']]  // Use database column name
      });

      return { prompts, total };
    } catch (error) {
      logger.error('Find all prompts failed:', error);
      throw new CustomError('Failed to retrieve prompts', 500);
    }
  }

  async findById(id: number) {
    try {
      const prompt = await Prompt.findByPk(id);

      return prompt;
    } catch (error) {
      logger.error('Find prompt by ID failed:', error);
      throw new CustomError('Failed to retrieve prompt', 500);
    }
  }

  async findByUserId(userId: number, page: number = 1, limit: number = 10) {
    try {
      // First get the username from user ID
      const user = await User.findByPk(userId, { attributes: ['username'] });
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await Prompt.findAndCountAll({
        where: { author: user.username },
        limit,
        offset,
        order: [['created_at', 'DESC']]  // Use database column name
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
        author: data.author,
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

      const validSortFields = ['title', 'created_at', 'updated_at', 'category'];
      const validSortOrders = ['asc', 'desc'];

      // Map camelCase to snake_case for database columns
      const fieldMapping: { [key: string]: string } = {
        'createdAt': 'created_at',
        'updatedAt': 'updated_at',
        'title': 'title',
        'category': 'category'
      };

      const dbOrderField = fieldMapping[sortBy] || 'created_at';
      const orderField = validSortFields.includes(dbOrderField) ? dbOrderField : 'created_at';
      const orderDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

      const { rows: prompts, count: total } = await Prompt.findAndCountAll({
        where: whereClause,
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
