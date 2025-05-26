'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class bitacora extends Model {
    static associate(models) {
      // Relaciones
    }
  }

  bitacora.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    accion: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    elementoid: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'bitacora',
  });
  
  return bitacora;
};