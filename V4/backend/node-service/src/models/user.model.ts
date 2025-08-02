import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserRole } from '@/types';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  lastLoginAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {
  id?: number;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public lastLoginAt?: Date;

  // Getters and setters for all fields to ensure consistent access
  public get id(): number {
    return this.getDataValue('id');
  }

  public set id(value: number) {
    this.setDataValue('id', value);
  }

  public get username(): string {
    return this.getDataValue('username');
  }

  public set username(value: string) {
    this.setDataValue('username', value);
  }

  public get email(): string {
    return this.getDataValue('email');
  }

  public set email(value: string) {
    this.setDataValue('email', value);
  }

  public get password(): string {
    return this.getDataValue('password');
  }

  public set password(value: string) {
    this.setDataValue('password', value);
  }

  public get role(): UserRole {
    return this.getDataValue('role');
  }

  public set role(value: UserRole) {
    this.setDataValue('role', value);
  }

  // Getters and setters for mapped fields
  public get firstName(): string | undefined {
    return this.getDataValue('firstName');
  }

  public set firstName(value: string | undefined) {
    this.setDataValue('firstName', value);
  }

  public get lastName(): string | undefined {
    return this.getDataValue('lastName');
  }

  public set lastName(value: string | undefined) {
    this.setDataValue('lastName', value);
  }

  public get enabled(): boolean {
    return this.getDataValue('enabled');
  }

  public set enabled(value: boolean) {
    this.setDataValue('enabled', value);
  }

  public get accountNonExpired(): boolean {
    return this.getDataValue('accountNonExpired');
  }

  public set accountNonExpired(value: boolean) {
    this.setDataValue('accountNonExpired', value);
  }

  public get accountNonLocked(): boolean {
    return this.getDataValue('accountNonLocked');
  }

  public set accountNonLocked(value: boolean) {
    this.setDataValue('accountNonLocked', value);
  }

  public get credentialsNonExpired(): boolean {
    return this.getDataValue('credentialsNonExpired');
  }

  public set credentialsNonExpired(value: boolean) {
    this.setDataValue('credentialsNonExpired', value);
  }

  static initModel(sequelize: Sequelize): typeof User {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'last_name',
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      accountNonExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'account_non_expired',
      },
      accountNonLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'account_non_locked',
      },
      credentialsNonExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'credentials_non_expired',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

    return User;
  }
}

export default User;
