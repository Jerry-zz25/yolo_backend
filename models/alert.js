'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Alert.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    severity: DataTypes.STRING,
    status: DataTypes.STRING,
    source: DataTypes.STRING,
    metadata: DataTypes.JSON,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Alert',
  });
  return Alert;
};