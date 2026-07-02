const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) { this.setDataValue('name', val.trim()); } // trim аналог
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(val) { this.setDataValue('email', val.trim()); }
  },
  phone: {
    type: DataTypes.BIGINT, // вмещает длинные номера телефонов
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) { this.setDataValue('password', val.trim()); }
  },
  accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  typewallet: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10000
  },
  useractived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  realwallet: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  enterConditional: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  followers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bonusClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  level: {
    type: DataTypes.VIRTUAL,
    get() {
      const wallet = this.getDataValue('wallet');
      if (wallet < 50000) return 1;
      if (wallet < 100000) return 2;
      if (wallet < 500000) return 3;
      if (wallet < 1000000) return 4;
      return 5;
    }
  }
}, {
  timestamps: true 
});

module.exports = User;