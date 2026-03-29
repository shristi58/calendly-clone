import 'dotenv/config';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

let _redisConnection: Redis | null = null;
let _emailQueue: Queue | null = null;

function getRedisConnection(): Redis {
  if (!_redisConnection) {
    _redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: null,
    });
  }
  return _redisConnection;
}

function getEmailQueue(): Queue {
  if (!_emailQueue) {
    _emailQueue = new Queue('emailQueue', {
      connection: getRedisConnection(),
    });
  }
  return _emailQueue;
}

/**
 * Enqueue a booking confirmation email
 */
export async function enqueueBookingConfirmation(bookingId: string) {
  await getEmailQueue().add(
    'sendBookingConfirmation',
    { bookingId },
    { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }
  );
}

/**
 * Enqueue a cancellation email
 */
export async function enqueueBookingCancellation(bookingId: string, cancelReason?: string) {
  await getEmailQueue().add(
    'sendCancellationEmail',
    { bookingId, cancelReason },
    { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }
  );
}

/**
 * Enqueue a reschedule email
 */
export async function enqueueBookingReschedule(bookingId: string) {
  await getEmailQueue().add(
    'sendReschedulingEmail',
    { bookingId },
    { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }
  );
}

/**
 * Exported for direct use in email.worker.ts
 */
export { getRedisConnection as redisConnection, getEmailQueue as emailQueue };
