'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class pedido extends Model {
    static associate(models) {
      pedido.belongsToMany(models.producto, { through: 'pedidoproducto', foreignKey: 'pedidoid'});
      pedido.belongsTo(models.usuario);
    }
  }
  pedido.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    usuarioid: {
      type: DataTypes.STRING(254),
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'pedido',
  });
  
  return pedido;
};