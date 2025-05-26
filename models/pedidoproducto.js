'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class pedidoproducto extends Model {
    static associate(models) {
    }
  }
  pedidoproducto.init({
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pedidoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    productoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'pedidoproducto',
  });
  
  return pedidoproducto;
};