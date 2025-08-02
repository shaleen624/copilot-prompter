import { DataTypes, Model, Sequelize } from 'sequelize';

export interface CopilotTemplateAttributes {
  id: number;
  name: string;
  category: string;
  language: string;
  framework?: string;
  description?: string;
  content: string;
  tags: string[];
  author: string;
  active: boolean;
  popularity: number;
  viewCount: number;
  downloadCount: number;
  createdAt?: Date;
  lastUpdated?: Date;
}

export interface CopilotTemplateCreationAttributes extends Omit<CopilotTemplateAttributes, 'id' | 'createdAt' | 'lastUpdated'> {
  id?: number;
  createdAt?: Date;
  lastUpdated?: Date;
}

export class CopilotTemplate extends Model<CopilotTemplateAttributes, CopilotTemplateCreationAttributes> implements CopilotTemplateAttributes {
  public id!: number;
  public name!: string;
  public category!: string;
  public language!: string;
  public framework?: string;
  public description?: string;
  public content!: string;
  public tags!: string[];
  public author!: string;
  public active!: boolean;
  public popularity!: number;
  public viewCount!: number;
  public downloadCount!: number;
  public createdAt!: Date;
  public lastUpdated!: Date;

  // Custom getters/setters for database field mappings - keeping for backward compatibility
  get user_id(): string {
    return this.getDataValue('author');
  }

  set user_id(value: string) {
    this.setDataValue('author', value);
  }

  get view_count(): number {
    return this.getDataValue('viewCount');
  }

  set view_count(value: number) {
    this.setDataValue('viewCount', value);
  }

  get download_count(): number {
    return this.getDataValue('downloadCount');
  }

  set download_count(value: number) {
    this.setDataValue('downloadCount', value);
  }

  get created_at(): Date {
    return this.getDataValue('createdAt') || new Date();
  }

  set created_at(value: Date) {
    this.setDataValue('createdAt', value);
  }

  get last_updated(): Date {
    return this.getDataValue('lastUpdated') || new Date();
  }

  set last_updated(value: Date) {
    this.setDataValue('lastUpdated', value);
  }

  static initModel(sequelize: Sequelize): typeof CopilotTemplate {
    CopilotTemplate.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      framework: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      author: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'author'
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      popularity: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      viewCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'view_count',
      },
      downloadCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'download_count',
      },
    }, {
      sequelize,
      modelName: 'CopilotTemplate',
      tableName: 'copilot_templates',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'last_updated',
    });

    return CopilotTemplate;
  }
}

export default CopilotTemplate;
