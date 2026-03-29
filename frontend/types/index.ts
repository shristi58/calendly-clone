export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  timezone: string;
  isOnboarded?: boolean;
  role?: string;
  avatarUrl?: string | null;
  welcomeMessage?: string | null;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
  country?: string;
  createdAt: string;
}

// ─── Event Types ────────────────────────────────────────────────────────────
export interface EventType {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  color: string;
  isActive: boolean;
  bufferBefore: number;
  bufferAfter: number;
  location?: string | null;
  scheduleId: string | null;
  schedulingType: "solo" | "round_robin" | "collective";
  questions: Question[];
  _count?: { bookings: number };
  user?: { id: string; name: string; timezone: string };
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  eventTypeId: string;
  question: string;
  type: "text" | "textarea" | "dropdown" | "radio";
  required: boolean;
  options: string[] | null;
  order: number;
}

// ─── Bookings ───────────────────────────────────────────────────────────────
export interface Booking {
  id: string;
  eventTypeId: string;
  inviteeName: string;
  inviteeEmail: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: "scheduled" | "cancelled" | "rescheduled";
  cancelReason: string | null;
  meetingLink: string | null;
  eventType?: { name: string; slug: string; duration: number; color?: string };
  answers?: BookingAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingAnswer {
  id: string;
  questionId: string;
  answer: string;
  question: { question: string; type: string };
}

// ─── Schedules & Availability ───────────────────────────────────────────────
export interface Schedule {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  availabilities?: Availability[];
  overrides?: AvailabilityOverride[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Availability {
  id: string;
  scheduleId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface AvailabilityOverride {
  id: string;
  scheduleId: string;
  date: string; // "YYYY-MM-DD"
  startTime: string | null; // null = day blocked
  endTime: string | null; // null = day blocked
}

// ─── Request Payloads ───────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  timezone?: string;
}

export interface CreateEventPayload {
  name: string;
  slug: string;
  description?: string;
  duration: number;
  color?: string;
  isActive?: boolean;
  bufferBefore?: number;
  bufferAfter?: number;
  scheduleId?: string;
  schedulingType?: "solo" | "round_robin" | "collective";
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}

export interface CreateBookingPayload {
  eventTypeId: string;
  inviteeName: string;
  inviteeEmail: string;
  startTime: string; // ISO 8601 UTC
  timezone?: string;
  answers?: { questionId: string; answer: string }[];
}

export interface CreateSchedulePayload {
  name: string;
  isDefault?: boolean;
}

export interface CreateAvailabilityPayload {
  scheduleId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CreateOverridePayload {
  scheduleId?: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
}

export interface OnboardingPayload {
  role: string;
  timezone: string;
  availabilities: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  location: string;
}

export interface CreateQuestionPayload {
  eventTypeId: string;
  question: string;
  type: "text" | "textarea" | "dropdown" | "radio";
  required?: boolean;
  options?: string[];
  order?: number;
}

export interface CancelBookingPayload {
  cancelReason?: string;
}

export interface RescheduleBookingPayload {
  startTime: string;
}

// ─── API Response Envelope ──────────────────────────────────────────────────
export interface ApiSuccessResponse<T> {
  status: "success";
  data: T;
}

export interface ApiErrorResponse {
  status: "fail" | "error";
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Auth Response ──────────────────────────────────────────────────────────
export interface AuthResponse {
  user: User;
}

// ─── Booking Filter ─────────────────────────────────────────────────────────
export type BookingFilter = "upcoming" | "past" | "cancelled";
