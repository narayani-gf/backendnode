'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class categoria extends Model {
    static associate(models) {
      categoria.belongsToMany(models.producto, { through: 'categoriaproducto', foreignKey: 'categoriaid' });
    }
  }

  categoria.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
    protegida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'categoria',
  });
  
  return categoria;
};