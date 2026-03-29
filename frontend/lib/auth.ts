/**
 * Auth utilities — timezone detection only.
 * Token management is now handled by secure HTTP-only cookies.
 */

/**
 * Detects the user's timezone via the browser.
 * Falls back to "UTC" on server or if detection fails.
 */
export function getTimezone(): string {
  if (typeof window === "undefined") return "UTC";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/**
 * Returns a human-readable timezone label.
 * e.g., "India Standard Time (2:01am)"
 */
export function getTimezoneLabel(timezone: string): string {
  try {
    const now = new Date();
    const longName =
      new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "long",
      })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value || timezone;

    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(now);

    return `${longName} (${time.toLowerCase()})`;
  } catch {
    return timezone;
  }
}
