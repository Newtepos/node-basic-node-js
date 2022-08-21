const Sequelize = require("sequelize");

const sequelize = Sequelize("node-complete", "root", "A1s2d3f4", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
