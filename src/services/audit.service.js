import { AuditLog } from "../models/index.js";

export async function logAction({
  user_id,
  action,
  entity,
  entity_id,
  metadata = {},
}) {
  return await AuditLog.create({
    user_id,
    action,
    entity,
    entity_id,
    metadata,
  });
}
