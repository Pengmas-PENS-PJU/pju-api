const { createUser, getUserById, updateUser, deleteUser, getUserList } = require('../services/userManagementService');

const createUserController = async (req, res) => {
  try {
    const result = await createUser(req);
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result,
      error_details: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
      error_details: null,
    });
  }
};

const getUserByIdController = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const user = await getUserById(userId);

    return res.status(200).json({
      success: true,
      message: `User with id (${userId}) retrieved successfully`,
      data: user,
      error_details: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
      error_details: null,
    });
  }
};

const updateUserController = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const user = await updateUser(req);

    return res.status(200).json({
      success: true,
      message: `User with id (${userId}) updated successfully`,
      data: user,
      error_details: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
      error_details: null,
    });
  }
};

const deleteUserController = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    await deleteUser(userId);

    return res.status(200).json({
      success: true,
      message: `User with id (${userId}) deleted successfully`,
      data: null,
      error_details: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
      error_details: null,
    });
  }
};

const getUserListController = async (req, res) => {
  try {
    const users = await getUserList();

    return res.status(200).json({
      success: true,
      message: 'User list retrieved successfully',
      data: users,
      error_details: null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null,
      error_details: null,
    });
  }
};

module.exports = { createUserController, getUserByIdController, updateUserController, deleteUserController, getUserListController };
