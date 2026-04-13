import { User } from "../../models/index.js";
import { hashPassword } from "../../utils/hash.js";

// CREATE USER
async function createUser(data, tenant_id) {
  const existingUser = await User.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    tenant_id,
    email: data.email,
    password: hashedPassword,
    first_name: data.first_name,
    last_name: data.last_name,
    status: "active",
  });

  return user;
}

// GET ALL USERS (TENANT ISOLATION)
async function getUsers(tenant_id) {
  return await User.findAll({
    where: { tenant_id },
    attributes: { exclude: ["password"] },
  });
}

// GET SINGLE USER
async function getUserById(id, tenant_id) {
  const user = await User.findOne({
    where: { id, tenant_id },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// UPDATE USER
async function updateUser(id, tenant_id, data) {
  const user = await User.findOne({
    where: { id, tenant_id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({
    first_name: data.first_name,
    last_name: data.last_name,
    status: data.status,
  });

  return user;
}

// DELETE USER
async function deleteUser(id, tenant_id) {
  const user = await User.findOne({
    where: { id, tenant_id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await user.destroy();

  return { message: "User deleted successfully" };
}

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
