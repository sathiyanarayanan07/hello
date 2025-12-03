const { query, getDB } = require('../config/db');

const logger = require('../utils/logger');

const getAllUsers = async (req, res) => {
  try {
    const users = await query('SELECT id, name, email FROM users');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const db = getDB();

    // ✅ Step 1: Delete related holidays first (to avoid foreign key errors)
    await db.run(`DELETE FROM holidays WHERE created_by = ?`, [userId]);

    // ✅ Step 2: Delete the user
    const result = await db.run(`DELETE FROM users WHERE id = ?`, [userId]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`User ${userId} deleted successfully`);
    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};

const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  // Basic validation
  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  try {
    const db = getDB();

    // Check if user exists
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role
    await db.run(`UPDATE users SET role = ? WHERE id = ?`, [role, userId]);

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    logger.error("Error updating user role:", error);
    res.status(500).json({
      message: "Error updating user role",
      error: error.message,
    });
  }
};


module.exports = {
  getAllUsers,
  deleteUser,
  updateUserRole,
  
};