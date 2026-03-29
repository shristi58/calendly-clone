import { Response } from 'express';
import {
  AuthRequest,
  generateAccessToken,
  createRefreshSession,
  setAuthCookies,
} from '../middlewares/auth.js';
import {
  OAuthService,
  generateOAuthState,
  verifyOAuthState,
} from '../services/oauth.service.js';

function getFrontendUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:3000';
}

// ── Google ─────────────────────────────────────────────────────────────────────

/** GET /api/auth/google  — initiates a login OAuth flow */
export const googleAuthUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('login');
  res.redirect(OAuthService.getGoogleAuthUrl(state));
};

/** GET /api/auth/google/callback */
export const googleCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code) return res.redirect(`${getFrontendUrl()}/login?error=no_code`);
    if (!state) {
      return res.redirect(`${getFrontendUrl()}/login?error=missing_state`);
    }

    // Verify HMAC signature + expiry — no cookie needed
    const { intent } = verifyOAuthState(state);

    const user = await OAuthService.handleGoogleCallback(code, state);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await createRefreshSession(user.id, req);
    setAuthCookies(res, accessToken, refreshToken);

    res.redirect(`${getFrontendUrl()}/callback`);
  } catch (error: any) {
    console.error('[Google OAuth Error]', error.message);
    res.redirect(`${getFrontendUrl()}/login?error=${encodeURIComponent(error.message)}`);
  }
};

/** GET /api/auth/link/google  — authenticated user links their Google account */
export const googleLinkUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('link', req.userId);
  res.redirect(OAuthService.getGoogleAuthUrl(state));
};

/** GET /api/auth/link/google/callback */
export const googleLinkCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code || !state) {
      return res.redirect(`${getFrontendUrl()}/app/settings?error=oauth_failed`);
    }

    // Verify HMAC signature + expiry
    verifyOAuthState(state);

    await OAuthService.handleGoogleCallback(code, state, req.userId);

    res.redirect(`${getFrontendUrl()}/app/settings?linked=google`);
  } catch (error: any) {
    console.error('[Google Link Error]', error.message);
    res.redirect(`${getFrontendUrl()}/app/settings?error=${encodeURIComponent(error.message)}`);
  }
};

// ── Microsoft ──────────────────────────────────────────────────────────────────

/** GET /api/auth/microsoft  — initiates a login OAuth flow */
export const microsoftAuthUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('login');
  res.redirect(OAuthService.getMicrosoftAuthUrl(state));
};

/** GET /api/auth/microsoft/callback */
export const microsoftCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code) return res.redirect(`${getFrontendUrl()}/login?error=no_code`);
    if (!state) {
      return res.redirect(`${getFrontendUrl()}/login?error=missing_state`);
    }

    // Verify HMAC signature + expiry — no cookie needed
    verifyOAuthState(state);

    const user = await OAuthService.handleMicrosoftCallback(code, state);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await createRefreshSession(user.id, req);
    setAuthCookies(res, accessToken, refreshToken);

    res.redirect(`${getFrontendUrl()}/callback`);
  } catch (error: any) {
    console.error('[Microsoft OAuth Error]', error.message);
    res.redirect(`${getFrontendUrl()}/login?error=${encodeURIComponent(error.message)}`);
  }
};

/** GET /api/auth/link/microsoft  — authenticated user links their Microsoft account */
export const microsoftLinkUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('link', req.userId);
  res.redirect(OAuthService.getMicrosoftAuthUrl(state));
};

/** GET /api/auth/link/microsoft/callback */
export const microsoftLinkCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code || !state) {
      return res.redirect(`${getFrontendUrl()}/app/settings?error=oauth_failed`);
    }

    // Verify HMAC signature + expiry
    verifyOAuthState(state);

    await OAuthService.handleMicrosoftCallback(code, state, req.userId);

    res.redirect(`${getFrontendUrl()}/app/settings?linked=microsoft`);
  } catch (error: any) {
    console.error('[Microsoft Link Error]', error.message);
    res.redirect(`${getFrontendUrl()}/app/settings?error=${encodeURIComponent(error.message)}`);
  }
};
