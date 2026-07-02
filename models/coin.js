const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coin = sequelize.define('Coin', {
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = Coin;