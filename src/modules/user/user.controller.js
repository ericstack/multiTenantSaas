import userService from "./user.service.js";

// CREATE USER
export const createUser = async (req, res, next) => {
  try {
    const tenant_id = req.user.tenant_id;

    const user = await userService.createUser(req.body, tenant_id);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// GET ALL USERS
export const getUsers = async (req, res, next) => {
  try {
    const tenant_id = req.user.tenant_id;

    const users = await userService.getUsers(tenant_id);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE USER
export const getUser = async (req, res, next) => {
  try {
    const tenant_id = req.user.tenant_id;
    const { id } = req.params;

    const user = await userService.getUserById(id, tenant_id);

    // 🔥 Only log if accessing OTHER user
    if (req.user.user_id !== user.id) {
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const tenant_id = req.user.tenant_id;
    const { id } = req.params;

    const user = await userService.updateUser(id, tenant_id, req.body);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// DELETE USER
export const deleteUser = async (req, res, next) => {
  try {
    const tenant_id = req.user.tenant_id;
    const { id } = req.params;

    const result = await userService.deleteUser(id, tenant_id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
