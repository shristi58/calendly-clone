import { google } from 'googleapis';
import crypto from 'crypto';
import { prisma } from '../db/index.js';
import { AppError } from '../utils/errors.js';
import type { User } from '../generated/prisma/client.js';

// ── CSRF helpers ─────────────────────────────────────────────────────────────

const STATE_SECRET = process.env.JWT_SECRET || 'oauth-state-secret';

/**
 * Generate a self-contained, HMAC-signed OAuth state parameter.
 * No cookie is needed — the state carries its own integrity proof.
 */
export const generateOAuthState = (intent: 'login' | 'link', userId?: string): string => {
  const nonce = crypto.randomBytes(16).toString('hex');
  const ts = Date.now();
  const payload = JSON.stringify({ nonce, intent, userId: userId ?? null, ts });
  const data = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', STATE_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
};

/**
 * Verify and parse the HMAC-signed state received in the OAuth callback.
 * Throws if the signature is invalid or the state has expired (>10 min).
 */
export const verifyOAuthState = (state: string): { nonce: string; intent: 'login' | 'link'; userId: string | null } => {
  const dotIdx = state.lastIndexOf('.');
  if (dotIdx === -1) throw new AppError(400, 'Invalid OAuth state format');

  const data = state.substring(0, dotIdx);
  const sig = state.substring(dotIdx + 1);
  const expectedSig = crypto.createHmac('sha256', STATE_SECRET).update(data).digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    throw new AppError(400, 'OAuth state signature mismatch — possible CSRF attack');
  }

  try {
    const decoded = Buffer.from(data, 'base64url').toString('utf-8');
    const parsed = JSON.parse(decoded);

    // Reject states older than 10 minutes
    if (parsed.ts && Date.now() - parsed.ts > 10 * 60 * 1000) {
      throw new AppError(400, 'OAuth state expired');
    }

    return { nonce: parsed.nonce, intent: parsed.intent, userId: parsed.userId };
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(400, 'Invalid OAuth state parameter');
  }
};

// Legacy aliases kept for backward compat but no longer needed by controller
export const parseOAuthState = verifyOAuthState;
export const extractNonce = (_state: string): string => 'unused';

// ── Username generator ────────────────────────────────────────────────────────

const generateUsername = (email: string): string => {
  const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${base}-${Math.floor(Math.random() * 10000)}`;
};

// ── OAuthService ──────────────────────────────────────────────────────────────

export class OAuthService {
  // ── Google ──────────────────────────────────────────────────────────────────

  private static getGoogleAuthClient() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI ||
        `${process.env.BASE_URL || 'http://localhost:8000'}/api/auth/google/callback`
    );
  }

  static getGoogleAuthUrl(state: string): string {
    const oauth2Client = this.getGoogleAuthClient();
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state,
    });
  }

  static async handleGoogleCallback(
    code: string,
    state: string,
    linkingUserId?: string | null
  ): Promise<User> {
    // 1. Parse state (HMAC already verified by controller)
    const { intent, userId: stateUserId } = verifyOAuthState(state);

    // 2. Exchange code for tokens
    const oauth2Client = this.getGoogleAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 3. Fetch Google profile
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    if (!profile.email) throw new AppError(400, 'No email returned from Google');

    // 4. Resolve user
    const user = await this.resolveUser({
      provider: 'google',
      providerAccountId: profile.id!,
      email: profile.email,
      name: profile.name || 'Google User',
      avatarUrl: profile.picture ?? undefined,
      intent,
      linkingUserId: linkingUserId ?? stateUserId,
      tokens: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token ?? null,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    return user;
  }

  // ── Microsoft ────────────────────────────────────────────────────────────────

  static getMicrosoftAuthUrl(state: string): string {
    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const redirectUri =
      process.env.MICROSOFT_REDIRECT_URI ||
      `${process.env.BASE_URL || 'http://localhost:8000'}/api/auth/microsoft/callback`;
    const scopes = encodeURIComponent('offline_access Calendars.ReadWrite User.Read');

    return (
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize` +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scopes}` +
      `&state=${encodeURIComponent(state)}`
    );
  }

  static async handleMicrosoftCallback(
    code: string,
    state: string,
    linkingUserId?: string | null
  ): Promise<User> {
    // 1. Parse state (HMAC already verified by controller)
    const { intent, userId: stateUserId } = verifyOAuthState(state);

    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
    const redirectUri =
      process.env.MICROSOFT_REDIRECT_URI ||
      `${process.env.BASE_URL || 'http://localhost:8000'}/api/auth/microsoft/callback`;

    // 2. Exchange code for tokens
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new AppError(502, `Microsoft token exchange failed: ${await tokenResponse.text()}`);
    }

    const tokens: any = await tokenResponse.json();

    // 3. Fetch Microsoft Graph profile
    const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
      throw new AppError(502, `Microsoft Graph fetch failed: ${await profileResponse.text()}`);
    }

    const profile: any = await profileResponse.json();
    const email = profile.mail || profile.userPrincipalName;

    if (!email) throw new AppError(400, 'No email returned from Microsoft');

    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + (tokens.expires_in ?? 3600));

    // 4. Resolve user
    const user = await this.resolveUser({
      provider: 'microsoft',
      providerAccountId: profile.id,
      email,
      name: profile.displayName || 'Microsoft User',
      avatarUrl: undefined,
      intent,
      linkingUserId: linkingUserId ?? stateUserId,
      tokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        expiryDate,
      },
    });

    return user;
  }

  // ── Shared user resolution ───────────────────────────────────────────────────

  private static async resolveUser(params: {
    provider: 'google' | 'microsoft';
    providerAccountId: string;
    email: string;
    name: string;
    avatarUrl?: string;
    intent: 'login' | 'link';
    linkingUserId: string | null;
    tokens: { accessToken: string; refreshToken: string | null; expiryDate: Date | null };
  }): Promise<User> {
    const { provider, providerAccountId, email, name, avatarUrl, intent, linkingUserId, tokens } = params;

    let user: User | null = null;

    // ── Account Linking flow ──────────────────────────────────────────────────
    if (intent === 'link' && linkingUserId) {
      user = await prisma.user.findUnique({ where: { id: linkingUserId } });
      if (!user) throw new AppError(404, 'User account not found for linking');
    }

    // ── Login / Registration flow ─────────────────────────────────────────────
    if (!user) {
      // Try to find by this provider's account ID first (most specific match)
      const oauthAccount = await prisma.oAuthAccount.findFirst({
        where: { provider, providerAccountId },
        include: { user: true },
      });

      if (oauthAccount) {
        user = oauthAccount.user;
      }
    }

    if (!user) {
      // Try to find by email
      const existingByEmail = await prisma.user.findUnique({ where: { email } });

      if (existingByEmail) {
        // ⚠️  SECURITY: Only allow implicit linking if the existing account is also OAuth-only.
        // Accounts created with a password require explicit verification before linking.
        if (existingByEmail.password !== null) {
          throw new AppError(
            409,
            `An account with this email already exists. Please log in with your password and link your ${provider === 'google' ? 'Google' : 'Microsoft'} account from your profile settings.`
          );
        }
        user = existingByEmail;
      }
    }

    if (!user) {
      // New user — create with a generated username
      const username = generateUsername(email);
      user = await prisma.user.create({
        data: {
          email,
          name,
          username,
          password: null,
          avatarUrl: avatarUrl ?? null,
          timezone: 'UTC',
        },
      });
    } else if (avatarUrl && !user.avatarUrl) {
      // Back-fill avatar for existing users who don't have one
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl },
      });
    }

    // ── Upsert OAuth credentials ──────────────────────────────────────────────
    await prisma.oAuthAccount.upsert({
      where: { userId_provider: { provider, userId: user.id } },
      create: {
        userId: user.id,
        provider,
        providerAccountId,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiryDate: tokens.expiryDate,
      },
      update: {
        accessToken: tokens.accessToken,
        ...(tokens.refreshToken ? { refreshToken: tokens.refreshToken } : {}),
        expiryDate: tokens.expiryDate,
      },
    });

    return user;
  }
}
