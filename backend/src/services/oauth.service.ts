import { google } from 'googleapis';
import { prisma } from '../db/index.js';
import type { User } from '../generated/prisma/client.js';

export class OAuthService {
  private static getGoogleAuthClient() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.BASE_URL || 'http://localhost:3000'}/api/oauth/google/callback`
    );
  }

  static getGoogleAuthUrl(userId?: string) {
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
      state: userId,
    });
  }

  static async handleGoogleCallback(code: string, userId?: string) {
    const oauth2Client = this.getGoogleAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      throw new Error('No email found from Google');
    }

    let user: User | null = null;

    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      user = await prisma.user.findUnique({ where: { email: userInfo.email } });
    }

    if (!user) {
      // Create new user for social login — password is null (not empty string)
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name || 'Google User',
          password: null,
        },
      });
    }

    // Upsert OAuthAccount
    await prisma.oAuthAccount.upsert({
      where: {
        userId_provider: {
          provider: 'google',
          userId: user.id,
        },
      },
      create: {
        userId: user.id,
        provider: 'google',
        providerAccountId: userInfo.id!,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      update: {
        accessToken: tokens.access_token!,
        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    return user;
  }

  // ---- MICROSOFT OAUTH ----
  static getMicrosoftAuthUrl(userId?: string) {
    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const redirectUri = `${process.env.BASE_URL || 'http://localhost:3000'}/api/oauth/microsoft/callback`;
    const scopes = encodeURIComponent('offline_access Calendars.ReadWrite User.Read');

    return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${userId || ''}`;
  }

  static async handleMicrosoftCallback(code: string, userId?: string) {
    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
    const redirectUri = `${process.env.BASE_URL || 'http://localhost:3000'}/api/oauth/microsoft/callback`;

    const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange Microsoft token: ${await tokenResponse.text()}`);
    }

    const tokens: any = await tokenResponse.json();

    const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch Microsoft profile: ${await profileResponse.text()}`);
    }

    const userInfo: any = await profileResponse.json();
    const email = userInfo.mail || userInfo.userPrincipalName;

    if (!email) {
      throw new Error('No email found from Microsoft Graph');
    }

    let user: User | null = null;

    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: userInfo.displayName || 'Microsoft User',
          password: null, // OAuth users have no password
        },
      });
    }

    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);

    await prisma.oAuthAccount.upsert({
      where: {
        userId_provider: {
          provider: 'microsoft',
          userId: user.id,
        },
      },
      create: {
        userId: user.id,
        provider: 'microsoft',
        providerAccountId: userInfo.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: expiryDate,
      },
      update: {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
        expiryDate: expiryDate,
      },
    });

    return user;
  }
}
