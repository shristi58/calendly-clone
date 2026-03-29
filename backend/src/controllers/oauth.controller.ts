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
  extractNonce,
} from '../services/oauth.service.js';

const isProd = () => process.env.NODE_ENV === 'production';

const NONCE_COOKIE = 'oauth_nonce';

/** Set a short-lived HttpOnly cookie carrying the CSRF nonce */
function setNonceCookie(res: Response, nonce: string) {
  res.cookie(NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutes — enough for the OAuth round-trip
    path: '/',
  });
}

function clearNonceCookie(res: Response) {
  res.clearCookie(NONCE_COOKIE, { path: '/' });
}

function getFrontendUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:3000';
}

// ── Google ─────────────────────────────────────────────────────────────────────

/** GET /api/auth/google  — initiates a login OAuth flow */
export const googleAuthUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('login');
  const nonce = extractNonce(state);
  setNonceCookie(res, nonce);
  res.redirect(OAuthService.getGoogleAuthUrl(state));
};

/** GET /api/auth/google/callback */
export const googleCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const storedNonce = req.cookies?.[NONCE_COOKIE] as string | undefined;

    if (!code) return res.redirect(`${getFrontendUrl()}/login?error=no_code`);
    if (!state || !storedNonce) {
      return res.redirect(`${getFrontendUrl()}/login?error=missing_state`);
    }

    clearNonceCookie(res);

    const user = await OAuthService.handleGoogleCallback(code, state, storedNonce);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await createRefreshSession(user.id, req);
    setAuthCookies(res, accessToken, refreshToken);

    res.redirect(`${getFrontendUrl()}/callback`);
  } catch (error: any) {
    console.error('[Google OAuth Error]', error.message);
    clearNonceCookie(res);
    res.redirect(`${getFrontendUrl()}/login?error=${encodeURIComponent(error.message)}`);
  }
};

/** GET /api/auth/link/google  — authenticated user links their Google account */
export const googleLinkUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('link', req.userId);
  const nonce = extractNonce(state);
  setNonceCookie(res, nonce);
  res.redirect(OAuthService.getGoogleAuthUrl(state));
};

/** GET /api/auth/link/google/callback */
export const googleLinkCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const storedNonce = req.cookies?.[NONCE_COOKIE] as string | undefined;

    if (!code || !state || !storedNonce) {
      return res.redirect(`${getFrontendUrl()}/app/settings?error=oauth_failed`);
    }

    clearNonceCookie(res);

    await OAuthService.handleGoogleCallback(code, state, storedNonce, req.userId);

    res.redirect(`${getFrontendUrl()}/app/settings?linked=google`);
  } catch (error: any) {
    console.error('[Google Link Error]', error.message);
    clearNonceCookie(res);
    res.redirect(`${getFrontendUrl()}/app/settings?error=${encodeURIComponent(error.message)}`);
  }
};

// ── Microsoft ──────────────────────────────────────────────────────────────────

/** GET /api/auth/microsoft  — initiates a login OAuth flow */
export const microsoftAuthUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('login');
  const nonce = extractNonce(state);
  setNonceCookie(res, nonce);
  res.redirect(OAuthService.getMicrosoftAuthUrl(state));
};

/** GET /api/auth/microsoft/callback */
export const microsoftCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const storedNonce = req.cookies?.[NONCE_COOKIE] as string | undefined;

    if (!code) return res.redirect(`${getFrontendUrl()}/login?error=no_code`);
    if (!state || !storedNonce) {
      return res.redirect(`${getFrontendUrl()}/login?error=missing_state`);
    }

    clearNonceCookie(res);

    const user = await OAuthService.handleMicrosoftCallback(code, state, storedNonce);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await createRefreshSession(user.id, req);
    setAuthCookies(res, accessToken, refreshToken);

    res.redirect(`${getFrontendUrl()}/callback`);
  } catch (error: any) {
    console.error('[Microsoft OAuth Error]', error.message);
    clearNonceCookie(res);
    res.redirect(`${getFrontendUrl()}/login?error=${encodeURIComponent(error.message)}`);
  }
};

/** GET /api/auth/link/microsoft  — authenticated user links their Microsoft account */
export const microsoftLinkUrl = (req: AuthRequest, res: Response) => {
  const state = generateOAuthState('link', req.userId);
  const nonce = extractNonce(state);
  setNonceCookie(res, nonce);
  res.redirect(OAuthService.getMicrosoftAuthUrl(state));
};

/** GET /api/auth/link/microsoft/callback */
export const microsoftLinkCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const storedNonce = req.cookies?.[NONCE_COOKIE] as string | undefined;

    if (!code || !state || !storedNonce) {
      return res.redirect(`${getFrontendUrl()}/app/settings?error=oauth_failed`);
    }

    clearNonceCookie(res);

    await OAuthService.handleMicrosoftCallback(code, state, storedNonce, req.userId);

    res.redirect(`${getFrontendUrl()}/app/settings?linked=microsoft`);
  } catch (error: any) {
    console.error('[Microsoft Link Error]', error.message);
    clearNonceCookie(res);
    res.redirect(`${getFrontendUrl()}/app/settings?error=${encodeURIComponent(error.message)}`);
  }
};
