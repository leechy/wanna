/**
 * Function returns a date in a human readable format:
 * Last Monday/Tuesday/Wednesday/Thursday/Friday/Saturday/Sunday
 * 2/3 days ago
 * Yesterday
 * Today
 * Tomorrow
 * In 2/3 days
 * Next Monday/Tuesday/Wednesday/Thursday/Friday/Saturday/Sunday
 * or the date in format DD MMMM with added year if the date is more than 6 months away
 *
 * @param {number} date - date in milliseconds since epoch
 * @returns {string} - human readable date
 */
export function humanDate(date: number): string {
  const now = Date.now();
  const diff = date - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const dayOfWeek = new Date(date).getDay();
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const monthNames = [
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

  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Tomorrow';
  } else if (days === -1) {
    return 'Yesterday';
  } else if (days > 1 && days < 4) {
    return `In ${days} days`;
  } else if (days < -1 && days > -4) {
    return `${-days} days ago`;
  } else if (days >= 4 && days < 7) {
    return `Next ${dayNames[dayOfWeek]}`;
  } else if (days <= -4 && days > -7) {
    return `Last ${dayNames[dayOfWeek]}`;
  } else if ((days >= 7 && days < 183) || (days <= -7 && days > -183)) {
    return `${day} ${monthNames[month]}`;
  } else {
    return `${day} ${monthNames[month]} ${year}`;
  }
}
