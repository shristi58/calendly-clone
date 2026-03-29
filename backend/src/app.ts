import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { AppError } from './utils/errors.js';
import routes from './routes/index.js';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = (
    process.env.FRONTEND_URL ||
    (isProd ? '' : 'http://localhost:3000,http://localhost:5173')
)
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no Origin header (server-side redirects,
            // same-origin navigations, Postman, health-checks, OAuth redirects).
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { status: 'error', message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authIpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { status: 'error', message: 'Too many auth attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => {
        const email = (req.body?.email || '').toLowerCase().trim();
        return email || 'unauthenticated';
    },
    skip: (req) => {
        // Only enforce this per-email limit on the login endpoint
        return req.method !== 'POST' || !req.path.includes('login');
    },
    message: {
        status: 'error',
        message: 'Too many login attempts for this account. Please try again in 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
});

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authIpLimiter);
app.use('/api/auth', authEmailLimiter);
app.use('/api', apiLimiter);
app.use('/api', routes);

app.use((req, res, next) => {
    next(new AppError(404, 'Not Found'));
});

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ status: 'error', message: 'CORS: Origin not allowed' });
        return;
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: statusCode >= 500 ? 'error' : 'fail',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});
