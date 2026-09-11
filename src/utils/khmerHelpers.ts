export function toKhmerNumber(num: number | string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  const str = num.toString();
  return str
    .split('')
    .map(ch => {
      const n = parseInt(ch, 10);
      return !isNaN(n) ? khmerDigits[n] : ch;
    })
    .join('');
}

export function formatKhmerDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;

  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();

  const khmerDays = [
    'ថ្ងៃអាទិត្យ',
    'ថ្ងៃច័ន្ទ',
    'ថ្ងៃអង្គារ',
    'ថ្ងៃពុធ',
    'ថ្ងៃព្រហស្បតិ៍',
    'ថ្ងៃសុក្រ',
    'ថ្ងៃសៅរ៍',
  ];
  const khmerMonths = [
    'មករា',
    'កុម្ភៈ',
    'មីនា',
    'មេសា',
    'ឧសភា',
    'មិថុនា',
    'កក្កដា',
    'សីហា',
    'កញ្ញា',
    'តុលា',
    'វិច្ឆិកា',
    'ធ្នូ',
  ];

  const dStr = d < 10 ? `0${d}` : `${d}`;
  return `${khmerDays[dayOfWeek]} ទី${toKhmerNumber(dStr)} ខែ${khmerMonths[m - 1]} ឆ្នាំ${toKhmerNumber(y)}`;
}

export function formatEnDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;

  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();

  const enDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const enMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dStr = d < 10 ? `0${d}` : `${d}`;
  return `${enDays[dayOfWeek]}, ${enMonths[m - 1]} ${dStr}, ${y}`;
}

export function generateGoogleCalendarUrl(
  title: string,
  details: string,
  location: string,
  startDateStr: string,
  endDateStr?: string
): string {
  // Format for Google Calendar URL: YYYYMMDDTHHMMSSZ
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : new Date(start.getTime() + 4 * 60 * 60 * 1000);

  const formatGCalDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: dates,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(
  title: string,
  description: string,
  location: string,
  startDateStr: string
) {
  const start = new Date(startDateStr);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

  const formatDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlanEssential//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'wedding_invitation.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
