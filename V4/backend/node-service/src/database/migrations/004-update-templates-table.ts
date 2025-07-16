import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  // Add the tags column as JSON
  await queryInterface.addColumn('copilot_templates', 'tags', {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  });

  // Rename author column to user_id and change type
  await queryInterface.renameColumn('copilot_templates', 'author', 'user_id');
  
  // Change the user_id column to be an integer with foreign key constraint
  await queryInterface.changeColumn('copilot_templates', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Remove the old author index and add user_id index
  await queryInterface.removeIndex('copilot_templates', 'copilot_templates_author');
  await queryInterface.addIndex('copilot_templates', ['user_id'], {
    name: 'copilot_templates_user_id'
  });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  // Remove the user_id index and add author index
  await queryInterface.removeIndex('copilot_templates', 'copilot_templates_user_id');
  
  // Change user_id back to author
  await queryInterface.changeColumn('copilot_templates', 'user_id', {
    type: DataTypes.STRING(100),
    allowNull: false
  });
  
  await queryInterface.renameColumn('copilot_templates', 'user_id', 'author');
  
  // Add the author index back
  await queryInterface.addIndex('copilot_templates', ['author'], {
    name: 'copilot_templates_author'
  });

  // Remove the tags column
  await queryInterface.removeColumn('copilot_templates', 'tags');
};
