import { AuditLog } from "../models/index.js";

export function auditLogger(options = {}) {
  return (req, res, next) => {
    const start = Date.now();

    res.on("finish", async () => {
      try {
        // Skip if no user (public routes)
        if (!req.user) return;

        // Skip GET if configured
        if (options.skipGet && req.method === "GET") return;

        const action = mapAction(req.method, req.route?.path);

        await AuditLog.create({
          user_id: req.user.user_id,
          tenant_id: req.user.tenant_id,
          action,
          entity: options.entity || extractEntity(req.route?.path),
          entity_id: req.params.id || null,
          metadata: {
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            duration_ms: Date.now() - start,
          },
          ip_address: req.ip,
          user_agent: req.headers["user-agent"],
        });
      } catch (err) {
        console.error("Audit log error:", err.message);
      }
    });

    next();
  };
}
function mapAction(method, path = "") {
  const map = {
    POST: "CREATE",
    PUT: "UPDATE",
    PATCH: "UPDATE",
    DELETE: "DELETE",
    GET: "VIEW",
  };

  const base = map[method] || method;

  if (path?.includes("login")) return "LOGIN";
  if (path?.includes("logout")) return "LOGOUT";

  return base;
}

function extractEntity(path = "") {
  if (!path) return "Unknown";

  const parts = path.split("/").filter(Boolean);
  return parts[0] || "Unknown"; // e.g. /users → "users"
}
