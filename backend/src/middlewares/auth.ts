import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { prisma } from '../db/index.js';

export interface AuthRequest extends Request {
  userId?: string;
}

// ── ENV helpers ────────────────────────────────────────────────
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set.');
  }
  return secret;
}

const isProd = () => process.env.NODE_ENV === 'production';

// ── Token generation ──────────────────────────────────────────

/** Short-lived access token — 15 minutes */
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '15m' });
};

/** Create a DB-backed refresh session, returns the opaque token string */
export const createRefreshSession = async (
  userId: string,
  req: Request
): Promise<string> => {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress: req.ip || req.socket.remoteAddress || null,
      userAgent: req.headers['user-agent']?.slice(0, 255) || null,
    },
  });

  return token;
};

// ── Cookie helpers ────────────────────────────────────────────

const COOKIE_OPTIONS_BASE = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  const secure = isProd();

  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS_BASE,
    secure,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS_BASE,
    secure,
    sameSite: 'lax',
    path: '/api/auth/refresh', // only sent to the refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res: Response) {
  const secure = isProd();

  res.clearCookie('accessToken', {
    ...COOKIE_OPTIONS_BASE,
    secure,
  });

  res.clearCookie('refreshToken', {
    ...COOKIE_OPTIONS_BASE,
    secure,
    sameSite: 'lax',
    path: '/api/auth/refresh',
  });
}

// ── Auth middleware ────────────────────────────────────────────

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  // 1. Try cookie first
  let token = req.cookies?.accessToken;

  // 2. Fall back to Authorization header (for scripts / Postman)
  if (!token) {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }
  }

  if (!token) {
    return next(new AppError(401, 'Authentication required'));
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
};
