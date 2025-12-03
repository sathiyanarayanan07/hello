const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  // storage: path.join(__dirname, '../../data/database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Set WAL and busy timeout after Sequelize connects
(async () => {
  await sequelize.query('PRAGMA journal_mode=WAL;');
  await sequelize.query('PRAGMA busy_timeout=5000;');
})();

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  query: sequelize.query.bind(sequelize),
  run: sequelize.query.bind(sequelize)
};
