export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // Only log unexpected server errors (skip normal 401/403 auth failures)
  if (status >= 500 && process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status).json({ error: message });
}
