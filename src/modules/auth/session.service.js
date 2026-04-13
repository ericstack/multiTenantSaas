import { Session } from "../../models/index.js";

export async function createSession(user_id, refresh_token, meta = {}) {
  return await Session.create({
    user_id,
    refresh_token,
    user_agent: meta.user_agent || null,
    ip_address: meta.ip_address || null,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
}

export async function findSession(refresh_token) {
  return await Session.findOne({
    where: { refresh_token, revoked: false },
  });
}

export async function revokeSession(refresh_token) {
  return await Session.update({ revoked: true }, { where: { refresh_token } });
}
