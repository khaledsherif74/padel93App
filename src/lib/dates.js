// The ONLY place dates are formatted. Business-day rules stay on the server; the UI just shows Cairo time.
const TZ = 'Africa/Cairo';
const time = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
const stamp = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
const day = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (iso) => time.format(new Date(iso));
export const formatTimeRange = (from, to) => `${formatTime(from)}–${formatTime(to)}`;
export const formatStamp = (iso) => stamp.format(new Date(iso));
/** 'YYYY-MM-DD' (a business date) -> "Mon, 19 Oct 2026". */
export const formatBusinessDate = (date) => day.format(new Date(`${date}T00:00:00Z`));
export const toHours = (minutes) => Number((minutes / 60).toFixed(2));
