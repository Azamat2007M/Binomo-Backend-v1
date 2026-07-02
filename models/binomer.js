const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Binomer = sequelize.define('Binomer', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false 
});

module.exports = Binomer;