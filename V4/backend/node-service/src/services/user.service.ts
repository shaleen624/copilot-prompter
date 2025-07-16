import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User, UserCreationAttributes } from '@/models/user.model';
import { CustomError } from '@/middleware/errorHandler';
import { UserRole } from '@/types';

export class UserService {
  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await User.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async createUser(userData: UserCreationAttributes): Promise<User> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });

    if (existingUser) {
      throw new CustomError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    return await User.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.USER,
      enabled: true,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
    });
  }

  async updateUser(id: number, userData: Partial<UserCreationAttributes>): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // If password is being updated, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    await user.update(userData);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    await user.destroy();
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateLastLogin(id: number): Promise<void> {
    await User.update(
      { lastLoginAt: new Date() },
      { where: { id } }
    );
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      users: rows,
      total: count,
      page,
      limit,
    };
  }

  async toggleUserStatus(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    user.enabled = !user.enabled;
    await user.save();

    return user;
  }
}
