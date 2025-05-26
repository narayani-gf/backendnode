'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    static associate(models) {
      usuario.belongsTo(models.rol);
    }
  }

  usuario.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(254),
      unique: true,
      allowNull: false
    },
    passwordhash: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    protegido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rolid: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'usuario',
  });
  
  return usuario;
};