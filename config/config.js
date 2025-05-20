// config/config.js
require('dotenv').config(); 

module.exports = {
  development: {
    username: process.env.DB_USER,         // admin
    password: process.env.DB_PASS,         // Wzz1995825.
    database: process.env.DB_NAME,         // anomaly_db
    host:     process.env.DB_HOST,         // database-1.cr2q4iqw0jl5.us-east-2.rds.amazonaws.com
    port:     process.env.DB_PORT,         // 3306
    dialect:  'mysql',
    logging:  false,
  },
};

