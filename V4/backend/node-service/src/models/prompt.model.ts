import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PromptAttributes {
  id: number;
  title: string;
  prompt: string;
  description?: string;
  category: string;
  language: string;
  author: string;  // Database uses 'author' field instead of userId
  active: boolean;
  viewCount: number;
  copyCount: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  public category!: string;
  public language!: string;
  public author!: string;  // Database uses 'author' field
  public active!: boolean;
  public viewCount!: number;
  public copyCount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  get view_count(): number {
    return this.getDataValue('viewCount');
  }

  set view_count(value: number) {
    this.setDataValue('viewCount', value);
  }

  get copy_count(): number {
    return this.getDataValue('copyCount');
  }

  set copy_count(value: number) {
    this.setDataValue('copyCount', value);
  }

  get created_at(): Date {
    return this.getDataValue('createdAt') || new Date();
  }

  set created_at(value: Date) {
    this.setDataValue('createdAt', value);
  }

  get updated_at(): Date {
    return this.getDataValue('updatedAt') || new Date();
  }

  set updated_at(value: Date) {
    this.setDataValue('updatedAt', value);
  }

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
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
