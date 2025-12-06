import { logError } from "./logger.js";

export function errorHandler(err, req, res, next) {
  logError(err.message);
  res.status(500).json({ error: err.message });
}
