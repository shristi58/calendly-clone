import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const eventTypeSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  slug: z
    .string()
    .min(1, "URL slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  duration: z.number().min(5).max(1440),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .optional(),
  bufferBefore: z.number().min(0).max(120).optional(),
  bufferAfter: z.number().min(0).max(120).optional(),
  scheduleId: z.string().uuid().optional().or(z.literal("")),
  schedulingType: z.enum(["solo", "round_robin", "collective"]).optional(),
});

export const bookingSchema = z.object({
  inviteeName: z.string().min(2, "Name must be at least 2 characters"),
  inviteeEmail: z.string().email("Please enter a valid email address"),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  type: z.enum(["text", "textarea", "dropdown", "radio"]),
  required: z.boolean().default(true),
  options: z.array(z.string()).optional(),
  order: z.number().default(0),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EventTypeFormData = z.infer<typeof eventTypeSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
