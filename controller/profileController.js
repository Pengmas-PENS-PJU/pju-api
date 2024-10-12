const { getProfile, updateProfile, deleteProfile, updatePassword } = require('../services/profileService');
const { getTokenFromHeader } = require('../utils/jwtToken');

const getProfileController = async (req, res) => {
  const accessToken = getTokenFromHeader(req);

  try {
    const userProfile = await getProfile(accessToken);

    return res.status(200).json({
      success: true,
      message: 'Profile/Account retrieved successfully',
      data: userProfile,
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

const updateProfileController = async (req, res) => {
  const accessToken = getTokenFromHeader(req);

  try {
    const userProfile = await updateProfile(accessToken, req);

    return res.status(200).json({
      success: true,
      message: 'Profile/Account updated successfully',
      data: userProfile,
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

const deleteProfileController = async (req, res) => {
  const accessToken = getTokenFromHeader(req);

  try {
    await deleteProfile(accessToken);

    return res.status(200).json({
      success: true,
      message: 'Profile/Account deleted successfully',
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

const updatePasswordController = async (req, res) => {
  const accessToken = getTokenFromHeader(req);

  try {
    await updatePassword(accessToken, req);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
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

module.exports = { getProfileController, updateProfileController, deleteProfileController, updatePasswordController };
