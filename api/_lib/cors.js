function isAllowedDevelopmentOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export function applyCors(req, res, methods) {
  const origin = req.headers.origin;
  if (!origin) return true;

  let allowed = false;
  if (process.env.NODE_ENV === 'production') {
    const configuredOrigin = process.env.PRODUCTION_ORIGIN;
    if (!configuredOrigin) {
      res.status(503).json({ error: 'Production origin is not configured.' });
      return false;
    }

    try {
      allowed = new URL(configuredOrigin).origin === origin;
    } catch {
      res.status(503).json({ error: 'Production origin configuration is invalid.' });
      return false;
    }
  } else {
    allowed = isAllowedDevelopmentOrigin(origin);
  }

  if (!allowed) {
    res.status(403).json({ error: 'Origin is not allowed.' });
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');
  res.setHeader('Vary', 'Origin');
  return true;
}
