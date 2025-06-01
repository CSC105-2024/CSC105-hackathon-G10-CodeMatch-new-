import type { MiddlewareHandler } from 'hono';
import { verifyToken } from '../utils/token.js';
import { getCookie } from 'hono/cookie';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, 'token');

  if (!token) {
    return c.json({ success: false, msg: 'Unauthorized: Missing token' }, 401);
  }

  const payload = verifyToken(token);

  if (!payload) {
    return c.json({ success: false, msg: 'Unauthorized: Invalid token' }, 401);
  }

  c.set('userId', payload.userId);
  await next();
};
