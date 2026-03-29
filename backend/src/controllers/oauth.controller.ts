import { Request, Response } from 'express';
import { 
  AuthRequest, 
  generateAccessToken, 
  createRefreshSession, 
  setAuthCookies 
} from '../middlewares/auth.js';
import { OAuthService } from '../services/oauth.service.js';

export const googleAuthUrl = (req: AuthRequest, res: Response) => {
  const userId = req.userId; // Optional, if linking account
  const url = OAuthService.getGoogleAuthUrl(userId);
  res.redirect(url);
};

export const googleCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    
    if (!code) {
      return res.status(400).json({ status: 'error', message: 'No code provided' });
    }

    const userId = state ? state : undefined;
    const user = await OAuthService.handleGoogleCallback(code, userId);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await createRefreshSession(user.id, req);
    
    setAuthCookies(res, accessToken, refreshToken);
    
    // Redirect back to frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/callback`);
  } catch (error: any) {
    console.error('Google OAuth Error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
};

export const microsoftAuthUrl = (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const url = OAuthService.getMicrosoftAuthUrl(userId);
  res.redirect(url);
};

export const microsoftCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code) {
      return res.status(400).json({ status: 'error', message: 'No code provided' });
    }

    const userId = state ? state : undefined;
    const user = await OAuthService.handleMicrosoftCallback(code, userId);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await createRefreshSession(user.id, req);
    
    setAuthCookies(res, accessToken, refreshToken);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/callback`);
  } catch (error: any) {
    console.error('Microsoft OAuth Error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
};
