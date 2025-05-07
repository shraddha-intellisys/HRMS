const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../config/google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });
const calendarId = 'primary'; // or use your calendar ID

async function addHolidayToCalendar(holiday) {
  try {
    const event = {
      summary: `Holiday: ${holiday.name}`,
      description: 'Public holiday added from HRMS',
      start: {
        date: holiday.date.split('T')[0],
      },
      end: {
        date: holiday.date.split('T')[0],
      },
    };

    await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log(`✅ Added holiday "${holiday.name}" to Google Calendar`);
  } catch (err) {
    console.error('❌ Google Calendar error:', err);
  }
}

module.exports = { addHolidayToCalendar };
