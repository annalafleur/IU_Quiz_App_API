// Third party
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../../.env')})

// Connection settings
const connectionConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

// Check if SSL should be enabled
if (process.env.DB_SSL == 'true' || process.env.DB_SSL == 'TRUE' || process.env.DB_SSL == '1'){
  connectionConfig.ssl = {
    rejectUnauthorized: false
  }
}

// Check if logging should be enabled
if (process.env.DB_LOGGING == 'true' || process.env.DB_LOGGING == 'TRUE' || process.env.DB_LOGGING == '1'){
  connectionConfig.debug = true
} else {
  connectionConfig.debug = false
}

// Return config
module.exports = {
  client: process.env.DB_CLIENT,
  connection: connectionConfig,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: '_migrations'
  }
}