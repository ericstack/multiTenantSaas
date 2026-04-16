import jwt from "jsonwebtoken";

export function generateAccessToken(user, permissions) {
  return jwt.sign(
    {
      user_id: user.id,
      tenant_id: user.tenant_id,
      permissions: permissions,
      is_super_admin: user.is_super_admin || false,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      user_id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
