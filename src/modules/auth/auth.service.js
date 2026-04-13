import { User, Tenant, Role, Session } from "../../models/index.js";
import bcrypt, { compare } from "bcrypt";
import {
  emailVerification,
  checkEmailDuplicate,
} from "../../utils/emailVerification.js";
import { hashPassword, passwordLengthCheck } from "../../utils/hashing.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./token.service.js";
import {
  findSession,
  revokeSession,
  createSession,
} from "./session.service.js";

async function register(data) {
  const { company_name, domain, email, password } = data;

  try {
    //check if required fields is not empty
    if (!company_name || !domain || !email || !password) {
      return { error: "All fields are required" };
    }

    //check if email is valid
    if (!emailVerification(email)) {
      return { error: "Invalid email format" };
    }
    //check if password is strong enough and lenght
    if (!passwordLengthCheck(password)) {
      return { error: "Password must be at least 8 characters long" };
    }
    //check if email is already in use
    if (await checkEmailDuplicate(email)) {
      return { error: "Email is already in use" };
    }

    // check if tenant with same domain exists
    const tenantCheck = await Tenant.findOne({
      where: { domain },
    });
    // console.log("Tenant check result:", tenantCheck);
    if (tenantCheck) {
      return { error: "Tenant with this subdomain already exists" };
    }

    // 1. Create tenant
    const tenantResult = await Tenant.create({
      name: company_name,
      domain: domain,
    });

    const tenantId = tenantResult.id;

    // // 2. Create admin role if not exists
    let role = await Role.findOne({
      where: { name: "admin" },
    });

    let roleId;

    if (!role) {
      const newRole = await Role.create({ tenant_id: tenantId, name: "admin" });
      roleId = newRole.id;
    } else {
      roleId = role.id;
    }

    // // 3. Hash password
    const hashedPassword = await hashPassword(password);
    // // 4. Create user
    const userResult = await User.create({
      tenant_id: tenantId,
      email: email,
      password: hashedPassword,
      role_id: roleId,
    });

    const userId = userResult.id;

    return {
      message: "Registered successfully",
      user: {
        id: userResult.id,
        email: userResult.email,
        tenant_id: userResult.tenant_id,
      },
    };
  } catch (error) {
    console.error("Error during tenant registration:", error);
    return {
      error: "An error occurred during registration",
    };
  }
}

async function login(data) {
  const { email, password } = data.body;

  try {
    //check if required fields is not empty
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    //check if email is valid
    if (!emailVerification(email)) {
      return { error: "Invalid email format" };
    }

    //check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { error: "User doesn't exist" };
    }

    //check if password is correct
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid password" };
    }

    //generate JWT token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const savedSession = await createSession(user.id, refreshToken, [
      data.headers["user-agent"],
      data.ip,
    ]);

    return {
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        tenant_id: user.tenant_id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: "Login failed" };
  }
}
async function logout(refreshToken) {
  try {
    if (!refreshToken) {
      return { error: "Refresh token is required" };
    }

    // Delete session from database
    await revokeSession(refresh_token);

    return { message: "Logout successful" };
  } catch (err) {
    console.error(err);
    return { error: "Logout failed" };
  }
}
async function refreshToken(refreshToken) {
  try {
    if (!refreshToken) {
      return { error: "Refresh token is required" };
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.user_id;

    // Check if session exists
    const session = await Session.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!session) {
      return { error: "Invalid refresh token" };
    }
    // Generate new access token
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 4. Revoke old refresh token (rotation)
    await revokeSession(refreshToken);

    const newAccessToken = generateAccessToken(user, []);
    const newRefreshToken = generateRefreshToken(user);

    //create new session
    await createSession(user.id, newRefreshToken, meta);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_in: 900,
    };
  } catch (err) {
    console.error(err);
    return { error: "Failed to refresh token" };
  }
}
async function getCurrentUser(user_id) {
  console.log(user_id);
  try {
    const user = await User.findByPk(user_id, {
      attributes: ["id", "email", "tenant_id"],
    });
    return { user };
  } catch (err) {
    console.error(err);
    return { error: "Failed to fetch user" };
  }
}

async function getUserPermissions(user_id) {
  const user = await User.findByPk(user_id, {
    include: [
      {
        model: Role,
        include: [Permission],
      },
    ],
  });

  const permissions = [];

  user.Roles.forEach((role) => {
    role.Permissions.forEach((p) => {
      permissions.push(p.name);
    });
  });

  return [...new Set(permissions)]; // remove duplicates
}

export default {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  getUserPermissions,
};
