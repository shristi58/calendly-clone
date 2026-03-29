import 'dotenv/config';
import { app } from './app.js';
import { prisma } from './db/index.js';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  // Validate critical env vars before starting
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is required');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('FATAL: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  try {
    await prisma.$connect();
    console.log('✓ Connected to database');

    // Gracefully start background worker (non-blocking)
    try {
      await import('./jobs/email.worker.js');
      console.log('✓ Email worker started');
    } catch (workerError) {
      console.warn('⚠ Email worker failed to start (Redis may be unavailable):', (workerError as Error).message);
      console.warn('  Email notifications will be unavailable until Redis is connected.');
    }

    app.listen(PORT, () => {
      console.log(`✓ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
