import { google } from 'googleapis';
import { prisma } from '../db/index.js';

interface OAuthAccount {
  id: string;
  userId: string;
  provider: string;
  accessToken: string;
  refreshToken: string | null;
  expiryDate: Date | null;
}

export class CalendarService {
  private static getGoogleClient(account: OAuthAccount) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      expiry_date: account.expiryDate?.getTime()
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
  }

  // Fetch free/busy periods for a single Google account
  private static async getGoogleBusyTimes(account: OAuthAccount, startTime: Date, endTime: Date): Promise<{ start: Date, end: Date }[]> {
    try {
      const calendar = this.getGoogleClient(account);
      const res = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: 'primary' }], // Check primary calendar
        }
      });

      const busy = res.data.calendars?.primary?.busy || [];
      return busy.map((b: any) => ({
        start: new Date(b.start),
        end: new Date(b.end)
      }));
    } catch (error) {
      console.error(`Failed to fetch Google Calendar busy times for Account ${account.id}:`, error);
      return [];
    }
  }

  // Fetch free/busy periods for a single Microsoft account
  private static async getMicrosoftBusyTimes(account: OAuthAccount, startTime: Date, endTime: Date): Promise<{ start: Date, end: Date }[]> {
    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/calendar/getSchedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'outlook.timezone="UTC"'
        },
        body: JSON.stringify({
          schedules: [(account as any).providerAccountId || account.userId], // User's email/id
          startTime: {
            dateTime: startTime.toISOString(),
            timeZone: 'UTC'
          },
          endTime: {
            dateTime: endTime.toISOString(),
            timeZone: 'UTC'
          },
          availabilityViewInterval: 15
        })
      });

      if (!response.ok) {
        throw new Error(`Microsoft Graph error: ${await response.text()}`);
      }

      const data: any = await response.json();
      const busyTimes: { start: Date, end: Date }[] = [];

      data.value?.[0]?.scheduleItems?.forEach((item: any) => {
        if (item.status === 'busy' || item.status === 'oof') { // out of office
          busyTimes.push({
            start: new Date(item.start.dateTime + 'Z'), // ensuring UTC parsing
            end: new Date(item.end.dateTime + 'Z')
          });
        }
      });

      return busyTimes;
    } catch (error) {
      console.error(`Failed to fetch Microsoft Calendar busy times for Account ${account.id}:`, error);
      return [];
    }
  }

  /**
   * Fetches all external busy times for all connected accounts of a specific user.
   */
  static async getUserBusyTimes(userId: string, startTime: Date, endTime: Date): Promise<{ start: Date, end: Date }[]> {
    const accounts = await prisma.oAuthAccount.findMany({
      where: { userId }
    });

    if (accounts.length === 0) return [];

    const promises = accounts.map(account => {
      if (account.provider === 'google') {
        return this.getGoogleBusyTimes(account, startTime, endTime);
      } else if (account.provider === 'microsoft') {
        return this.getMicrosoftBusyTimes(account, startTime, endTime);
      }
      return [];
    });

    const results = await Promise.all(promises);
    return results.flat(); // Aggregate all busy times into one flat array
  }

  /**
   * Creates a calendar event on the primary connected calendar and returns the meeting link.
   */
  static async createEvent(
    userId: string,
    eventDetails: {
      summary: string;
      description: string;
      startTime: Date;
      endTime: Date;
      attendees: string[];
    }
  ): Promise<{ meetingLink: string | null, provider: string | null }> {
    const accounts = await prisma.oAuthAccount.findMany({ where: { userId } });
    if (accounts.length === 0) return { meetingLink: null, provider: null };

    // Prefer Google if available, else Microsoft
    const googleAccount = accounts.find(a => a.provider === 'google');
    const msAccount = accounts.find(a => a.provider === 'microsoft');

    if (googleAccount) {
      try {
        const calendar = this.getGoogleClient(googleAccount);
        const res = await calendar.events.insert({
          calendarId: 'primary',
          conferenceDataVersion: 1,
          requestBody: {
            summary: eventDetails.summary,
            description: eventDetails.description,
            start: { dateTime: eventDetails.startTime.toISOString() },
            end: { dateTime: eventDetails.endTime.toISOString() },
            attendees: eventDetails.attendees.map(email => ({ email })),
            conferenceData: {
              createRequest: { requestId: `calendly-${Date.now()}` }
            }
          }
        });
        return {
          meetingLink: res.data.hangoutLink || null,
          provider: 'google_meet'
        };
      } catch (err) {
        console.error('Failed to create Google Meet:', err);
      }
    }

    if (msAccount) {
      try {
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/events`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${msAccount.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subject: eventDetails.summary,
            body: { contentType: 'HTML', content: eventDetails.description },
            start: { dateTime: eventDetails.startTime.toISOString(), timeZone: 'UTC' },
            end: { dateTime: eventDetails.endTime.toISOString(), timeZone: 'UTC' },
            attendees: eventDetails.attendees.map(email => ({
              emailAddress: { address: email, name: email }, type: 'required'
            })),
            isOnlineMeeting: true,
            onlineMeetingProvider: 'teamsForBusiness'
          })
        });
        if (response.ok) {
          const data: any = await response.json();
          return {
            meetingLink: data.onlineMeeting?.joinUrl || null,
            provider: 'microsoft_teams'
          };
        }
      } catch (err) {
        console.error('Failed to create MS Teams meeting:', err);
      }
    }

    return { meetingLink: null, provider: null };
  }
}
