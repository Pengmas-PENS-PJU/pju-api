const prisma = require('../configs/prisma');
const CustomError = require('../utils/customError');
const { convertTimeZone } = require('../utils/convertTimeZone');
const { decodJwtToken } = require('../utils/jwtToken');
const bcrypt = require('bcryptjs');

const getProfile = async (accessToken) => {
  const decoded = decodJwtToken(accessToken);

  const user = await prisma.user.findUnique({
    where: { id: decoded.user_id },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  user.created_at = convertTimeZone(user.created_at);
  user.updated_at = convertTimeZone(user.updated_at);

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const updateProfile = async (accessToken, req) => {
  const decoded = decodJwtToken(accessToken);
  const { name, email, username } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id: decoded.user_id },
  });

  if (!existingUser) {
    throw new CustomError('User not found', 404);
  }

  if (username) {
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });
    if (existingUser && existingUser.id !== decoded.user_id) {
      throw new CustomError('Username already exists', 409);
    }
  }

  if (email) {
    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (existingEmail && existingEmail.id !== decoded.user_id) {
      throw new CustomError('Email already exists', 409);
    }
  }

  const user = await prisma.user.update({
    where: { id: decoded.user_id },
    data: {
      name: name || existingUser.name,
      email: email || existingUser.email,
      username: username || existingUser.username,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const deleteProfile = async (accessToken) => {
  const decoded = decodJwtToken(accessToken);

  const existingUser = await prisma.user.findUnique({
    where: { id: decoded.user_id },
  });

  if (!existingUser) {
    throw new CustomError('User not found', 404);
  }

  const user = await prisma.user.delete({
    where: { id: decoded.user_id },
  });

  return user;
};

const updatePassword = async (accessToken, req) => {
  const decoded = decodJwtToken(accessToken);
  const { old_password, new_password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id: decoded.user_id },
  });

  if (!existingUser) {
    throw new CustomError('User not found', 404);
  }

  const isPasswordMatch = await bcrypt.compare(old_password, existingUser.password);

  if (!isPasswordMatch) {
    throw new CustomError('Old password is incorrect', 400);
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);

  const user = await prisma.user.update({
    where: { id: decoded.user_id },
    data: {
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  updatePassword,
};
