import type { NextApiRequest, NextApiResponse } from 'next';

type RateLimitEntry = { count: number; lastAttempt: number };

const store = new Map<string, RateLimitEntry>();

const windowMs = 60_000;
const maxRequests = 10;

export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now - entry.lastAttempt > windowMs) {
    store.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  entry.lastAttempt = now;
  return { allowed: true, remaining: maxRequests - entry.count };
}

export async function applyRateLimit(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const identifier = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous';

  const { allowed, remaining } = await checkRateLimit(identifier);

  res.setHeader('X-RateLimit-Limit', maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());

  if (!allowed) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }

  return true;
}
