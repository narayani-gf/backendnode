'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class producto extends Model {
    static associate(models) {
      producto.belongsToMany(models.categoria, { through: 'categoriaproducto', foreignKey: 'productoid'});
      producto.belongsTo(models.archivo);
      producto.belongsToMany(models.pedido, { through: 'pedidoproducto', foreignKey: 'productoid'});
    }
  }

  producto.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(254),
      defaultValue: "Sin título",
    },
    descripcion: {
      type: DataTypes.STRING(254),
      defaultValue: "Sin descripción"
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    archivoid: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'producto',
  });
  
  return producto;
};