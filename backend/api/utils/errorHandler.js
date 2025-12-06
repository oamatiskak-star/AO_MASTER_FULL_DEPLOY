export function errorHandler(err, req, res, next) {
  console.error("SERVER ERROR:", err);
  return res.status(500).json({ error: err.message });
}
