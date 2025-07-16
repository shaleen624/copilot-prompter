import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.createTable('copilot_templates', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
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
    view_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    download_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Add indexes
  await queryInterface.addIndex('copilot_templates', ['category']);
  await queryInterface.addIndex('copilot_templates', ['language']);
  await queryInterface.addIndex('copilot_templates', ['framework']);
  await queryInterface.addIndex('copilot_templates', ['user_id']);
  await queryInterface.addIndex('copilot_templates', ['active']);
  await queryInterface.addIndex('copilot_templates', ['popularity']);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable('copilot_templates');
};
