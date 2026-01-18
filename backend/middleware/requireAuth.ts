// Deprecated adapter: this file exists to preserve the previous `requireAuth`
// API used by routes. It's a small compatibility shim that re-exports the
// JWT-based middleware. TODO: remove this adapter and update imports to
// `./jwtAuth.js` directly once all code references are migrated.
import {
  requireAuth as jwtRequireAuth,
  requireAdmin as jwtRequireAdmin,
} from "./jwtAuth.js";
export { jwtRequireAuth as requireAuth, jwtRequireAdmin as requireAdmin };
