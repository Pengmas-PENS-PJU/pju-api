const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Insert user
exports.insertUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const createdUser = await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: hashedPassword,
      role: user.role,
    },
  });

  const { password: _, ...userWithoutPassword } = createdUser;
  return userWithoutPassword;
};

// Get user by id
exports.getUserById = async (user_id) => {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get user by email
exports.getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Get all users
exports.getAllUsers = async () => {
  const users = await prisma.user.findMany();

  const usersWithoutPassword = users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return usersWithoutPassword;
};

// Update user
exports.updateUser = async (user_id, data) => {
  // Hash new password if provided
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user_id },
    data: {
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role,
    },
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// Delete user
exports.deleteUser = async (user_id) => {
  const deletedUser = await prisma.user.delete({
    where: { id: user_id },
  });

  const { password: _, ...userWithoutPassword } = deletedUser;
  return userWithoutPassword;
};
