// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../database.sqlite'),
  logging: false,
});

module.exports = {
  db: sequelize,        // <- essa linha é essencial
  Sequelize: Sequelize  // <- essa também, se você usa em models
};
