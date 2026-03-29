import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/index.js';
import {
  generateAccessToken,
  createRefreshSession,
  setAuthCookies,
  clearAuthCookies,
  AuthRequest,
} from '../middlewares/auth.js';
import { AppError } from '../utils/errors.js';

// Shared select for user responses — never leak password
const USER_SELECT = {
  id: true,
  name: true,
  username: true,
  email: true,
  timezone: true,
  role: true,
  isOnboarded: true,
  createdAt: true,
  avatarUrl: true,
  welcomeMessage: true,
  language: true,
  dateFormat: true,
  timeFormat: true,
  country: true,
};

export class AuthController {
  static async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, timezone } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new AppError(409, 'Email already registered');

      const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const username = `${baseUsername}-${Math.floor(Math.random() * 10000)}`;

      const hashed = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          password: hashed,
          timezone: timezone || 'UTC',
        },
        select: USER_SELECT,
      });

      // Generate tokens & set secure cookies
      const accessToken = generateAccessToken(user.id);
      const refreshToken = await createRefreshSession(user.id, req);
      setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) throw new AppError(401, 'Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AppError(401, 'Invalid credentials');

      // Generate tokens & set secure cookies
      const accessToken = generateAccessToken(user.id);
      const refreshToken = await createRefreshSession(user.id, req);
      setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            timezone: user.timezone,
            role: user.role,
            isOnboarded: user.isOnboarded,
            avatarUrl: user.avatarUrl,
            welcomeMessage: user.welcomeMessage,
            language: user.language,
            dateFormat: user.dateFormat,
            timeFormat: user.timeFormat,
            country: user.country,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: USER_SELECT,
      });
      if (!user) throw new AppError(404, 'User not found');
      res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, timezone, avatarUrl, welcomeMessage, language, dateFormat, timeFormat, country } = req.body;
      const data: Record<string, any> = {};
      if (name !== undefined) data.name = name;
      if (timezone !== undefined) data.timezone = timezone;
      if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
      if (welcomeMessage !== undefined) data.welcomeMessage = welcomeMessage;
      if (language !== undefined) data.language = language;
      if (dateFormat !== undefined) data.dateFormat = dateFormat;
      if (timeFormat !== undefined) data.timeFormat = timeFormat;
      if (country !== undefined) data.country = country;

      const user = await prisma.user.update({
        where: { id: req.userId },
        data,
        select: USER_SELECT,
      });
      res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  static async onboarding(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role, timezone, availabilities, location } = req.body;
      const userId = req.userId!;

      await prisma.user.update({
        where: { id: userId },
        data: {
          role,
          timezone,
          isOnboarded: true,
        },
      });

      // Create a default schedule
      const defaultSchedule = await prisma.schedule.create({
        data: {
          userId,
          name: 'Working Hours',
          isDefault: true,
          availabilities: {
            create: availabilities.map((a: any) => ({
              dayOfWeek: a.dayOfWeek,
              startTime: a.startTime,
              endTime: a.endTime,
            })),
          },
        },
      });

      // Create a default 30 min event type
      const slugSuffix = userId.replace(/-/g, '').slice(0, 8);
      await prisma.eventType.create({
        data: {
          userId,
          name: '30 Minute Meeting',
          slug: `30min-${slugSuffix}`,
          duration: 30,
          color: '#006BFF',
          location,
          scheduleId: defaultSchedule.id,
        },
      });

      res.status(200).json({ status: 'success', data: { isOnboarded: true, role } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   * Rotate the refresh token: revoke old session, create new session, set new cookies.
   * No authentication middleware needed — uses the refresh cookie directly.
   */
  static async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new AppError(401, 'No refresh token provided');
      }

      // Find the session
      const session = await prisma.session.findUnique({
        where: { token: refreshToken },
      });

      if (!session || session.isRevoked || session.expiresAt < new Date()) {
        // If the token was already revoked, someone may have stolen it
        // Revoke ALL sessions for this user as a safety measure
        if (session && session.isRevoked) {
          await prisma.session.updateMany({
            where: { userId: session.userId },
            data: { isRevoked: true },
          });
        }
        clearAuthCookies(res);
        throw new AppError(401, 'Invalid or expired refresh token');
      }

      // Revoke the old session (rotation)
      await prisma.session.update({
        where: { id: session.id },
        data: { isRevoked: true },
      });

      // Fetch the user
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: USER_SELECT,
      });
      if (!user) {
        clearAuthCookies(res);
        throw new AppError(401, 'User not found');
      }

      // Issue new tokens
      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = await createRefreshSession(user.id, req);
      setAuthCookies(res, newAccessToken, newRefreshToken);

      res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Revoke the current refresh session and clear all auth cookies.
   */
  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      // Revoke the session if we have one
      if (refreshToken) {
        await prisma.session.updateMany({
          where: { token: refreshToken, isRevoked: false },
          data: { isRevoked: true },
        });
      }

      clearAuthCookies(res);
      res.status(200).json({ status: 'success', data: { message: 'Logged out' } });
    } catch (error) {
      next(error);
    }
  }
}
