require("dotenv").config();
const fs = require("fs");
const path = require("path");

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",

    dialectOptions: {
      ssl: {
        require: true,
        ca: fs.readFileSync(path.join(__dirname, "../ca.pem")),
      },
    },

    logging: false,
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",

    dialectOptions: {
      ssl: {
        require: true,
       ca: fs.readFileSync(path.join(__dirname, "../ca.pem")),
      },
    },

    logging: false,
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",

    dialectOptions: {
      ssl: {
        require: true,
       ca: fs.readFileSync(path.join(__dirname, "../ca.pem")),
      },
    },

    logging: false,
  },
};