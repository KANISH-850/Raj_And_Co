const prisma = require('../../config/db');
const { success, error } = require('../../utils/response');

/**
 * List all users for approval
 */
const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, isApproved: true, createdAt: true }
    });
    return success(res, users, 'Users retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Update user status (approve/reject/make admin)
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isApproved, role },
      select: { id: true, name: true, email: true, role: true, isApproved: true }
    });

    return success(res, user, 'User updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, updateUser };
