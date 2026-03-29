import { Router } from 'express';
import { googleAuthUrl, googleCallback, microsoftAuthUrl, microsoftCallback } from '../controllers/oauth.controller.js';

const router = Router();

// Pass optional auth if we want to link accounts, else standard login
router.get('/google', googleAuthUrl);
router.get('/google/callback', googleCallback);

router.get('/microsoft', microsoftAuthUrl);
router.get('/microsoft/callback', microsoftCallback);

export default router;
