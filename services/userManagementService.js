const bcrypt = require('bcryptjs');
const prisma = require('../configs/prisma');
const CustomError = require('../utils/customError');
const { convertTimeZone } = require('../utils/convertTimeZone');

const createUser = async (req) => {
  const { username, email, name, password, role_code } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw new CustomError('Username already exists', 409);
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    throw new CustomError('Email already exists', 409);
  }

  const role = await prisma.role.findUnique({
    where: { code: role_code },
  });
  if (!role) {
    throw new CustomError('Role not found', 404);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      name,
      email,
      password: hashedPassword,
      role_code: role_code,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

const updateUser = async (req) => {
  const { userId } = req.params;
  const { username, email, name, role_code, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (username) {
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });
    if (existingUser && existingUser.id !== user.id) {
      throw new CustomError('Username already exists', 409);
    }
  }

  if (email) {
    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (existingEmail && existingEmail.id !== user.id) {
      throw new CustomError('Email already exists', 409);
    }
  }

  if (role_code) {
    const role = await prisma.role.findUnique({
      where: { code: role_code },
    });
    if (!role) {
      throw new CustomError('Role not found', 404);
    }
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: {
      username: username || user.username,
      email: email || user.email,
      name: name || user.name,
      role_code: role_code || user.role_code,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

const deleteUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  await prisma.user.delete({
    where: { id: userId },
  });
};

const getUserList = async () => {
  const users = await prisma.user.findMany({
    include: {
      role: true,
    },
    orderBy: {
      updated_at: 'desc',
    },
  });

  const usersWithoutPassword = users.map((user) => {
    user.created_at = convertTimeZone(user.created_at);
    user.updated_at = convertTimeZone(user.updated_at);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return usersWithoutPassword;
};

module.exports = { createUser, getUserById, updateUser, deleteUser, getUserList };
