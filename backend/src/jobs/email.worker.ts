import { Worker, Job } from 'bullmq';
import { Resend } from 'resend';
import { redisConnection, emailQueue } from './email.queue.js';
import { prisma } from '../db/index.js';
import { format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY || 're_1234');

export const emailWorker = new Worker('emailQueue', async (job: Job) => {
  if (job.name === 'sendBookingConfirmation') {
    const { bookingId } = job.data;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        eventType: { include: { user: true } },
      }
    });

    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    const startTimeFormatted = format(booking.startTime, 'PPPP, p');
    const meetingLinkText = booking.meetingLink ? `\n\nYour Meeting Link: ${booking.meetingLink}` : '';

    console.log(`Sending Confirmation Email to ${booking.inviteeEmail} for ${booking.eventType.name}...`);
    
    // In dev mode without real API key, log to console
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Calendly Clone <notifications@resend.dev>', // Update with real domain eventually
        to: [booking.inviteeEmail, booking.eventType.user.email],
        subject: `Confirmed: ${booking.eventType.name} with ${booking.eventType.user.name}`,
        text: `Hi ${booking.inviteeName},\n\nYour meeting "${booking.eventType.name}" with ${booking.eventType.user.name} is confirmed for ${startTimeFormatted}.${meetingLinkText}\n\nThanks,\nCalendly Team`
      });
    }
  } else if (job.name === 'sendCancellationEmail') {
    const { bookingId, cancelReason } = job.data;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        eventType: { include: { user: true } },
      }
    });

    if (!booking) return; // Silent discard if not found

    const startTimeFormatted = format(booking.startTime, 'PPPP, p');
    
    console.log(`Sending Cancellation Email to ${booking.inviteeEmail} for ${booking.eventType.name}...`);
    
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Calendly Clone <notifications@resend.dev>',
        to: [booking.inviteeEmail, booking.eventType.user.email],
        subject: `Canceled: ${booking.eventType.name} with ${booking.eventType.user.name}`,
        text: `Hi ${booking.inviteeName},\n\nYour meeting "${booking.eventType.name}" for ${startTimeFormatted} has been canceled.\n\nReason: ${cancelReason || 'No reason provided'}\n\nThanks,\nCalendly Team`
      });
    }
  } else if (job.name === 'sendReschedulingEmail') {
    const { bookingId } = job.data;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        eventType: { include: { user: true } },
      }
    });

    if (!booking) return;

    const startTimeFormatted = format(booking.startTime, 'PPPP, p');
    const meetingLinkText = booking.meetingLink ? `\n\nYour Updated Meeting Link: ${booking.meetingLink}` : '';
    
    console.log(`Sending Reschedule Email to ${booking.inviteeEmail} for ${booking.eventType.name}...`);
    
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Calendly Clone <notifications@resend.dev>',
        to: [booking.inviteeEmail, booking.eventType.user.email],
        subject: `Rescheduled: ${booking.eventType.name} with ${booking.eventType.user.name}`,
        text: `Hi ${booking.inviteeName},\n\nYour meeting "${booking.eventType.name}" with ${booking.eventType.user.name} has been rescheduled to ${startTimeFormatted}.${meetingLinkText}\n\nThanks,\nCalendly Team`
      });
    }
  }
}, { connection: redisConnection() });

emailWorker.on('completed', job => {
  console.log(`Job with id ${job.id} has been completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job with id ${job?.id} has failed with ${err.message}`);
});
