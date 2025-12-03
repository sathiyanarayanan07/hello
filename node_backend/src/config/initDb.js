const { run, query } = require('./db');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Number of salt rounds for password hashing
const SALT_ROUNDS = 10;

/**
 * Initializes the database by creating all required tables and indexes
 * @returns {Promise<void>}
 */
const initDatabase = async () => {
  try {
    logger.info('🔨 Initializing database...');
    
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      logger.info('📁 Created logs directory');
    }
    
    // Create users table if not exists
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        employee_id TEXT UNIQUE,
        role TEXT NOT NULL DEFAULT 'member',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create attendance table if not exists
    await run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('checkin', 'checkout')),
        timestamp DATETIME NOT NULL,
        notes TEXT,
        latitude REAL,
        longitude REAL,
        address TEXT,
        photo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create user_activity table if not exists
    await run(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_type TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes for better query performance
    await run('CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_attendance_timestamp ON attendance(timestamp)');
    // Create indexes for users table
    await run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await run('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await run('CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)');
    
    // Check if admin user exists, if not create one
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'; // Default password should be strong
    
    try {
      const [admin] = await query('SELECT * FROM users WHERE email = ?', [adminEmail]);
      
      if (!admin) {
        logger.info('👑 Creating default admin user...');
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
        
        await run(
          'INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
          ['Admin', adminEmail, hashedPassword, 'admin', 1]
        );
        
        logger.success('✅ Default admin user created');
        logger.info(`   Email: ${adminEmail}`);
        logger.info(`   Password: ${adminPassword}`);
        logger.warn('⚠️  Please change the default admin password immediately!');
      } else {
        logger.info('👑 Admin user already exists');
      }
    } catch (error) {
      logger.error('Error creating admin user:', error);
      throw error;
    }
    
    // Create remote_attendance_requests table if not exists
    await run(`
      CREATE TABLE IF NOT EXISTS remote_attendance_requests (
        request_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        request_date DATE NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        approved_by INTEGER,
        approved_at DATETIME,
        rejected_by INTEGER,
        rejected_at DATETIME,
        rejection_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (rejected_by) REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE(user_id, request_date) ON CONFLICT REPLACE
      )
    `);
    
    // Verify table was created
    const tableCheck = await query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='remote_attendance_requests'"
    );
    
    if (tableCheck && tableCheck.length > 0) {
      logger.info('✅ Verified remote_attendance_requests table exists');
      
      // Log table structure for debugging
      const tableInfo = await query('PRAGMA table_info(remote_attendance_requests)');
      logger.debug('remote_attendance_requests table structure:', tableInfo);
    } else {
      logger.error('❌ Failed to create remote_attendance_requests table');
      throw new Error('Failed to create remote_attendance_requests table');
    }

    // Create Tasks table
    await run(`
      CREATE TABLE IF NOT EXISTS Tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in-progress', 'review', 'completed')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
        assignedTo INTEGER,
        assignedBy INTEGER,
        dueDate DATETIME,
        completedAt DATETIME,
        progress INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (assignedBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create SubTasks table
    await run(`
      CREATE TABLE IF NOT EXISTS SubTasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        taskId INTEGER NOT NULL,
        assignedTo INTEGER, -- New column
        assignedBy INTEGER, -- New column
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (taskId) REFERENCES Tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL, -- Foreign key
        FOREIGN KEY (assignedBy) REFERENCES users(id) ON DELETE SET NULL  -- Foreign key
      )
    `);

    // Create Tags table
    await run(`
      CREATE TABLE IF NOT EXISTS Tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create TaskTags join table
    await run(`
      CREATE TABLE IF NOT EXISTS TaskTags (
        taskId INTEGER NOT NULL,
        tagId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (taskId, tagId),
        FOREIGN KEY (taskId) REFERENCES Tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (tagId) REFERENCES Tags(id) ON DELETE CASCADE
      )
    `);

    logger.info('✅ Database initialization completed successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

/**
 * Checks if the database is properly set up
 * @returns {Promise<{isValid: boolean, missingTables: string[], error?: string}>} Database status
 */
const checkDatabase = async () => {
  try {
    const requiredTables = [
      'users',
      'attendance',
      'user_activity',
      'remote_attendance_requests'
    ];
    const results = await query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN (?, ?, ?, ?)",
      requiredTables
    );
    
    const existingTables = results.map(row => row.name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    return {
      isValid: missingTables.length === 0,
      missingTables,
      existingTables,
      message: missingTables.length > 0 
        ? `Missing tables: ${missingTables.join(', ')}`
        : 'All required tables exist'
    };
  } catch (error) {
    const errorMsg = `Error checking database: ${error.message}`;
    logger.error(errorMsg);
    return {
      isValid: false,
      missingTables: [],
      error: errorMsg
    };
  }
};

/**
 * Drops all tables (for testing/development only)
 * @returns {Promise<void>}
 */
const resetDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Database reset is not allowed in production');
  }
  
  logger.warn('⚠️  Resetting database...');
  
  try {
    // Disable foreign keys temporarily
    await run('PRAGMA foreign_keys = OFF');
    
    // Get all tables
    const tables = await query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    // Drop all tables
    for (const table of tables) {
      logger.debug(`Dropping table: ${table.name}`);
      await run(`DROP TABLE IF EXISTS ${table.name}`);
    }
    
    // Re-enable foreign keys
    await run('PRAGMA foreign_keys = ON');
    
    logger.success('✅ Database reset successfully');
    
    // Re-initialize the database
    await initDatabase();
  } catch (error) {
    // Make sure to re-enable foreign keys even if there's an error
    await run('PRAGMA foreign_keys = ON');
    logger.error('Error resetting database:', error);
    throw error;
  }
};

module.exports = { 
  initDatabase, 
  checkDatabase,
  resetDatabase
};


// const { run, query } = require('./db');
// const logger = require('../utils/logger');
// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcryptjs');

// const SALT_ROUNDS = 10;

// const initDatabase = async () => {
//   try {
//     logger.info('🔨 Initializing PostgreSQL database...');

//     // Ensure logs directory exists
//     const logsDir = path.join(process.cwd(), 'logs');
//     if (!fs.existsSync(logsDir)) {
//       fs.mkdirSync(logsDir, { recursive: true });
//       logger.info('📁 Created logs directory');
//     }

//     // USERS TABLE
//     await run(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name TEXT NOT NULL,
//         email TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         employee_id TEXT UNIQUE,
//         role TEXT NOT NULL DEFAULT 'member',
//         is_active BOOLEAN DEFAULT TRUE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // ATTENDANCE TABLE
//     await run(`
//       CREATE TABLE IF NOT EXISTS attendance (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//         type TEXT NOT NULL CHECK (type IN ('checkin', 'checkout')),
//         timestamp TIMESTAMP NOT NULL,
//         notes TEXT,
//         latitude DOUBLE PRECISION,
//         longitude DOUBLE PRECISION,
//         address TEXT,
//         photo TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // USER ACTIVITY TABLE
//     await run(`
//       CREATE TABLE IF NOT EXISTS user_activity (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//         activity_type TEXT NOT NULL,
//         details TEXT,
//         ip_address TEXT,
//         user_agent TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // INDEXES
//     await run('CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id)');
//     await run('CREATE INDEX IF NOT EXISTS idx_attendance_timestamp ON attendance(timestamp)');
//     await run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
//     await run('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
//     await run('CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)');

//     // CREATE ADMIN USER
//     const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
//     const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

//     const adminResult = await query('SELECT * FROM users WHERE email = $1', [adminEmail]);
//     if (adminResult.length === 0) {
//       logger.info('👑 Creating default admin user...');
//       const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
//       await run(
//         'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)',
//         ['Admin', adminEmail, hashedPassword, 'admin', true]
//       );
//       logger.info(`✅ Admin created — Email: ${adminEmail}, Password: ${adminPassword}`);
//       logger.warn('⚠️  Change this password immediately.');
//     } else {
//       logger.info('👑 Admin user already exists.');
//     }

//     // REMOTE ATTENDANCE REQUESTS
//     await run(`
//       CREATE TABLE IF NOT EXISTS remote_attendance_requests (
//         request_id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//         request_date DATE NOT NULL,
//         reason TEXT NOT NULL,
//         status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
//         approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
//         approved_at TIMESTAMP,
//         rejected_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
//         rejected_at TIMESTAMP,
//         rejection_reason TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE (user_id, request_date)
//       )
//     `);

//     // TASKS
//     await run(`
//       CREATE TABLE IF NOT EXISTS tasks (
//         id SERIAL PRIMARY KEY,
//         title TEXT NOT NULL,
//         description TEXT,
//         status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'completed')),
//         priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
//         assignedTo INTEGER REFERENCES users(id) ON DELETE SET NULL,
//         assignedBy INTEGER REFERENCES users(id) ON DELETE SET NULL,
//         dueDate TIMESTAMP,
//         completedAt TIMESTAMP,
//         progress INTEGER DEFAULT 0,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // SUBTASKS
//     await run(`
//       CREATE TABLE IF NOT EXISTS subtasks (
//         id SERIAL PRIMARY KEY,
//         title TEXT NOT NULL,
//         completed BOOLEAN NOT NULL DEFAULT FALSE,
//         taskId INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
//         assignedTo INTEGER REFERENCES users(id) ON DELETE SET NULL,
//         assignedBy INTEGER REFERENCES users(id) ON DELETE SET NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // TAGS
//     await run(`
//       CREATE TABLE IF NOT EXISTS tags (
//         id SERIAL PRIMARY KEY,
//         name TEXT UNIQUE NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // TASK TAGS (many-to-many)
//     await run(`
//       CREATE TABLE IF NOT EXISTS tasktags (
//         taskId INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
//         tagId INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         PRIMARY KEY (taskId, tagId)
//       )
//     `);

//     logger.info('✅ PostgreSQL database initialization completed successfully');
//   } catch (error) {
//     logger.error('❌ Failed to initialize PostgreSQL database:', error);
//     throw error;
//   }
// };

// // Check database
// const checkDatabase = async () => {
//   try {
//     const requiredTables = ['users', 'attendance', 'user_activity', 'remote_attendance_requests'];
//     const results = await query(
//       `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
//     );

//     const existingTables = results.map(row => row.tablename);
//     const missingTables = requiredTables.filter(t => !existingTables.includes(t));

//     return {
//       isValid: missingTables.length === 0,
//       missingTables,
//       existingTables,
//       message:
//         missingTables.length > 0
//           ? `Missing tables: ${missingTables.join(', ')}`
//           : 'All required tables exist'
//     };
//   } catch (error) {
//     const msg = `Error checking database: ${error.message}`;
//     logger.error(msg);
//     return { isValid: false, missingTables: [], error: msg };
//   }
// };

// // Drop all tables (dev only)
// const resetDatabase = async () => {
//   if (process.env.NODE_ENV === 'production') {
//     throw new Error('Database reset is not allowed in production');
//   }

//   logger.warn('⚠️  Resetting PostgreSQL database...');

//   try {
//     await run(`
//       DO $$
//       DECLARE
//           r RECORD;
//       BEGIN
//           FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
//               EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
//           END LOOP;
//       END $$;
//     `);

//     logger.info('✅ Database cleared successfully.');
//     await initDatabase();
//   } catch (error) {
//     logger.error('❌ Error resetting database:', error);
//     throw error;
//   }
// };

// module.exports = {
//   initDatabase,
//   checkDatabase,
//   resetDatabase
// };