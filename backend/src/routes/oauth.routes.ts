import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  googleAuthUrl,
  googleCallback,
  googleLinkUrl,
  googleLinkCallback,
  microsoftAuthUrl,
  microsoftCallback,
  microsoftLinkUrl,
  microsoftLinkCallback,
} from '../controllers/oauth.controller.js';

const router = Router();

// ── Public Login Flows (unauthenticated) ──────────────────────────────────────
// These initiate a social login and create/find accounts automatically.

router.get('/google', googleAuthUrl);
router.get('/google/callback', googleCallback);

router.get('/microsoft', microsoftAuthUrl);
router.get('/microsoft/callback', microsoftCallback);

// ── Authenticated Account Linking Flows ───────────────────────────────────────
// These are used by a LOGGED-IN user to link an external OAuth provider.
// The `authenticate` middleware ensures req.userId is always present.

router.get('/link/google', authenticate, googleLinkUrl);
router.get('/link/google/callback', authenticate, googleLinkCallback);

router.get('/link/microsoft', authenticate, microsoftLinkUrl);
router.get('/link/microsoft/callback', authenticate, microsoftLinkCallback);

export default router;
