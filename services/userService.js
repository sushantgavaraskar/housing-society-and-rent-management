const User = require('../models/User');

class UserService {
  // Get all users with filtering and pagination
  static async getAllUsers(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const { role, isActive, society } = filters;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;
    if (society) filter.society = society;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .populate('society', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);

    return {
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Get user by ID
  static async getUserById(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('society', 'name');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user details
  static async updateUser(userId, updateData) {
    // Remove password from update data if present
    const { password, ...safeUpdateData } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      safeUpdateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Deactivate/Activate user
  static async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    return user;
  }

  // Get users by role
  static async getUsersByRole(role, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;

    const [users, total] = await Promise.all([
      User.find({ role })
        .select('-password')
        .populate('society', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments({ role })
    ]);

    return {
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Get users by society
  static async getUsersBySociety(societyId, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;

    const [users, total] = await Promise.all([
      User.find({ society: societyId })
        .select('-password')
        .populate('society', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments({ society: societyId })
    ]);

    return {
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Get user statistics
  static async getUserStatistics() {
    const [totalUsers, usersByRole, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      User.countDocuments({ isActive: true })
    ]);

    const roleStats = usersByRole.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: roleStats
    };
  }
}

module.exports = UserService; 