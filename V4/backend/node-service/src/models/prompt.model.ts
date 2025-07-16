import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PromptAttributes {
  id: number;
  title: string;
  prompt: string;
  description?: string;
  tags: string[];
  category: string;
  language: string;
  userId: number;
  active: boolean;
  viewCount: number;
  copyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptCreationAttributes extends Omit<PromptAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Prompt extends Model<PromptAttributes, PromptCreationAttributes> implements PromptAttributes {
  public id!: number;
  public title!: string;
  public prompt!: string;
  public description?: string;
  public tags!: string[];
  public category!: string;
  public language!: string;
  public userId!: number;
  public active!: boolean;
  public viewCount!: number;
  public copyCount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Prompt {
    Prompt.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        field: 'user_id',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      viewCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'view_count',
      },
      copyCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'copy_count',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    }, {
      sequelize,
      modelName: 'Prompt',
      tableName: 'prompts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

    return Prompt;
  }
}

export default Prompt;
