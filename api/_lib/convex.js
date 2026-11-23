const REQUEST_TIMEOUT_MS = 8_000;

function configurationError(message) {
  const error = new Error(message);
  error.name = 'ConfigurationError';
  return error;
}

export async function callConvex(operation, input) {
  const siteUrl = process.env.CONVEX_SITE_URL;
  const secret = process.env.CONVEX_API_SECRET;
  if (!siteUrl || !secret || Buffer.byteLength(secret) < 32) {
    throw configurationError('Convex gateway configuration is incomplete.');
  }

  let endpoint;
  try {
    const base = new URL(siteUrl);
    if (
      base.protocol !== 'https:' ||
      base.pathname !== '/' ||
      base.search ||
      base.hash ||
      !base.hostname.endsWith('.convex.site')
    ) {
      throw new Error('Invalid Convex site URL.');
    }
    endpoint = new URL('/gateway', base);
  } catch {
    throw configurationError('CONVEX_SITE_URL must be an HTTPS origin.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation, input }),
      signal: controller.signal,
    });
  } catch {
    const error = new Error('The Convex backend could not be reached.');
    error.name = 'ConvexConnectionError';
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('The Convex backend returned an invalid response.');
  }
  if (!response.ok) {
    const error = new Error(
      typeof result.error === 'string'
        ? result.error
        : 'The Convex backend could not complete the request.',
    );
    error.name = response.status === 503
      ? 'ConfigurationError'
      : 'ConvexGatewayError';
    error.status = response.status;
    throw error;
  }
  return result;
}
