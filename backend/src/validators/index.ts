import { z } from 'zod';

// ─────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  timezone: z.string().max(50).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens').optional(),
  timezone: z.string().max(50).optional(),
  role: z.string().max(100).optional(),
  isOnboarded: z.boolean().optional(),
  avatarUrl: z.string().max(2048).nullable().optional(),
  brandingLogo: z.string().nullable().optional(), // No strict base64 size limit in zod to prevent freezing parser, check handles in controller if necessary
  useCalendlyBranding: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  welcomeMessage: z.string().max(500).nullable().optional(),
  language: z.string().max(50).optional(),
  dateFormat: z.string().max(20).optional(),
  timeFormat: z.enum(['12h', '24h']).optional(),
  country: z.string().max(100).optional(),
}).refine(data => Object.values(data).some(v => v !== undefined), {
  message: 'At least one field must be provided',
});

export const onboardingSchema = z.object({
  role: z.string().max(100),
  timezone: z.string().max(50),
  availabilities: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  })),
  location: z.string().max(100),
});


// ─────────────────────────────────────────────────
// Event Types
// ─────────────────────────────────────────────────

export const createEventTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).optional().nullable(),
  duration: z.number().int().min(5, 'Duration must be at least 5 minutes').max(1440),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex color').optional(),
  location: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  bufferBefore: z.number().int().min(0).max(120).optional(),
  bufferAfter: z.number().int().min(0).max(120).optional(),
  scheduleId: z.string().uuid().optional().nullable(),
  teamId: z.string().uuid().optional().nullable(),
  maxInvitees: z.number().int().min(1).max(1000).optional(),
  schedulingType: z.enum(['solo', 'round_robin', 'collective']).optional(),
});

export const updateEventTypeSchema = createEventTypeSchema.partial();

// ─────────────────────────────────────────────────
// Schedules
// ─────────────────────────────────────────────────

export const createScheduleSchema = z.object({
  name: z.string().min(1, 'Schedule name is required').max(100),
  isDefault: z.boolean().optional(),
});

export const updateScheduleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isDefault: z.boolean().optional(),
}).refine(data => data.name !== undefined || data.isDefault !== undefined, {
  message: 'At least one field must be provided',
});

// ─────────────────────────────────────────────────
// Availability
// ─────────────────────────────────────────────────

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const availabilitySchema = z.object({
  scheduleId: z.string().uuid().optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:mm)'),
}).refine(data => data.startTime < data.endTime, {
  message: 'startTime must be before endTime',
  path: ['endTime'],
});

export const updateAvailabilitySchema = z.object({
  startTime: z.string().regex(timeRegex, 'Invalid time format').optional(),
  endTime: z.string().regex(timeRegex, 'Invalid time format').optional(),
}).refine(data => {
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: 'startTime must be before endTime',
  path: ['endTime'],
});

export const overrideSchema = z.object({
  scheduleId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  startTime: z.string().regex(timeRegex, 'Invalid time format').nullable().optional(),
  endTime: z.string().regex(timeRegex, 'Invalid time format').nullable().optional(),
}).refine(data => {
  // Either both times are provided, or both are null/undefined (block entire day)
  const hasStart = data.startTime !== null && data.startTime !== undefined;
  const hasEnd = data.endTime !== null && data.endTime !== undefined;
  return hasStart === hasEnd;
}, {
  message: 'Both startTime and endTime must be provided, or both must be null to block the entire day',
}).refine(data => {
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: 'startTime must be before endTime',
  path: ['endTime'],
});

// ─────────────────────────────────────────────────
// Bookings
// ─────────────────────────────────────────────────

export const createBookingSchema = z.object({
  eventTypeId: z.string().uuid(),
  inviteeName: z.string().min(1, 'Name is required').max(100),
  inviteeEmail: z.string().email('Invalid email address'),
  startTime: z.string().datetime({ message: 'startTime must be a valid ISO 8601 datetime' }),
  timezone: z.string().max(50).optional(),
  guestNotes: z.string().max(1000).optional(),
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    answer: z.string().min(1, 'Answer is required'),
  })).optional(),
});

export const rescheduleBookingSchema = z.object({
  startTime: z.string().datetime({ message: 'startTime must be a valid ISO 8601 datetime' }),
});

export const cancelBookingSchema = z.object({
  cancelReason: z.string().max(500).optional(),
});

// ─────────────────────────────────────────────────
// Questions
// ─────────────────────────────────────────────────

export const createQuestionSchema = z.object({
  eventTypeId: z.string().uuid(),
  question: z.string().min(1, 'Question text is required').max(500),
  type: z.enum(['text', 'textarea', 'dropdown', 'radio']).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string().min(1)).min(2, 'At least 2 options required for dropdown/radio').optional().nullable(),
  order: z.number().int().min(0).optional(),
}).refine(data => {
  // If type is dropdown or radio, options must be provided
  if (data.type === 'dropdown' || data.type === 'radio') {
    return data.options && data.options.length >= 2;
  }
  return true;
}, {
  message: 'Options with at least 2 items are required for dropdown and radio question types',
  path: ['options'],
});

export const updateQuestionSchema = z.object({
  question: z.string().min(1).max(500).optional(),
  type: z.enum(['text', 'textarea', 'dropdown', 'radio']).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string().min(1)).min(2).optional().nullable(),
  order: z.number().int().min(0).optional(),
});
