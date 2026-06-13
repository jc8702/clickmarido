import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getCalendarClient(accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function syncEvents(accessToken: string) {
  const calendar = getCalendarClient(accessToken);
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items;
}

export async function createGoogleEvent(accessToken: string, eventData: any) {
  const calendar = getCalendarClient(accessToken);
  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: eventData,
  });
  return res.data;
}

export async function updateGoogleEvent(accessToken: string, eventId: string, eventData: any) {
  const calendar = getCalendarClient(accessToken);
  const res = await calendar.events.update({
    calendarId: 'primary',
    eventId: eventId,
    requestBody: eventData,
  });
  return res.data;
}

export async function deleteGoogleEvent(accessToken: string, eventId: string) {
  const calendar = getCalendarClient(accessToken);
  await calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId,
  });
}
