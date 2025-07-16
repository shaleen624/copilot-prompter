import * as jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import { UserService } from '@/services/user.service';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { User } from '@/models/user.model';
import { AuthTokens, LoginRequest, RegisterRequest, UserRole } from '@/types';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(loginData: LoginRequest): Promise<AuthTokens> {
    try {
      const { username, password } = loginData;

      // Find user by username or email
      let user = await this.userService.findByUsername(username);
      if (!user) {
        user = await this.userService.findByEmail(username);
      }

      if (!user) {
        throw new CustomError('Invalid credentials', 401);
      }

      // Check if account is enabled
      if (!user.enabled) {
        throw new CustomError('Account is disabled', 401);
      }

      // Validate password
      const isPasswordValid = await this.userService.validatePassword(password, user.password);
      if (!isPasswordValid) {
        throw new CustomError('Invalid credentials', 401);
      }

      // Update last login
      await this.userService.updateLastLogin(user.id);

      // Generate tokens
      const tokens = this.generateTokens(user);

      logger.info(`User logged in: ${user.username}`, { userId: user.id });

      return tokens;
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async register(registerData: RegisterRequest): Promise<AuthTokens> {
    try {
      const userCreationData = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: UserRole.USER,
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
      };

      const user = await this.userService.createUser(userCreationData);
      const tokens = this.generateTokens(user);

      logger.info(`User registered: ${user.username}`, { userId: user.id });

      return tokens;
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
      
      if (decoded.type !== 'refresh') {
        throw new CustomError('Invalid refresh token', 401);
      }

      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new CustomError('User not found', 401);
      }

      if (!user.enabled) {
        throw new CustomError('Account is disabled', 401);
      }

      const tokens = this.generateTokens(user);

      logger.info(`Token refreshed for user: ${user.username}`, { userId: user.id });

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError('Invalid refresh token', 401);
      }
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      logger.info(`User logged out: ${decoded.username}`, { userId: decoded.id });
      
      // Here you could implement token blacklisting if needed
      // For now, we'll just log the logout
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  private generateTokens(user: User): AuthTokens {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessTokenPayload = { ...payload, type: 'access' };
    const refreshTokenPayload = { ...payload, type: 'refresh' };

    // For now, use a simple expiration time
    const accessToken = jwt.sign(
      accessTokenPayload,
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    // Calculate expiration time in seconds
    const expirationTime = 24 * 60 * 60; // 24 hours

    return {
      accessToken,
      refreshToken,
      expiresIn: expirationTime,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      if (decoded.type !== 'access') {
        throw new CustomError('Invalid token type', 401);
      }

      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new CustomError('User not found', 401);
      }

      if (!user.enabled) {
        throw new CustomError('Account is disabled', 401);
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError('Invalid token', 401);
      }
      throw error;
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      const isCurrentPasswordValid = await this.userService.validatePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new CustomError('Current password is incorrect', 400);
      }

      await this.userService.updateUser(userId, { password: newPassword });

      logger.info(`Password changed for user: ${user.username}`, { userId });
    } catch (error) {
      logger.error('Password change failed:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        logger.warn(`Password reset requested for non-existent email: ${email}`);
        return;
      }

      // Here you would implement password reset logic
      // For now, we'll just log the request
      logger.info(`Password reset requested for user: ${user.username}`, { userId: user.id });
      
      // TODO: Generate reset token and send email
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  }

  async resetPassword(resetToken: string, _newPassword: string): Promise<void> {
    try {
      // TODO: Implement password reset logic
      // This would involve validating the reset token and updating the password
      logger.info('Password reset attempted with token:', resetToken);
      
      throw new CustomError('Password reset not implemented', 501);
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  }
}
