/**
 * Function returns a date in a human readable format:
 * Last {day of the week} if the date is between 4 and 7 days ago
 * 2/3 days ago
 * Yesterday
 * Today
 * Tomorrow
 * In 2/3 days
 * Next {day of the week} if the date is between 4 and 7 days in the future
 * or the date in format DD MMMM with added year if the date is more than 6 months away
 *
 * @param {number} date - date in milliseconds since epoch
 * @returns {string} - human readable date
 */
export function humanDate(date: number): string {
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todayEnd = todayStart + 1000 * 60 * 60 * 24;

  if (date >= todayStart && date < todayEnd) {
    return 'Today';
  }

  // TODO: when localized, use toLocaleString() call
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  if (date < todayStart) {
    // past branch
    const daysDiff = Math.ceil((todayStart - date) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      return 'Yesterday';
    } else if (daysDiff > 1 && daysDiff < 4) {
      return `${daysDiff} days ago`;
    } else if (daysDiff >= 4 && daysDiff < 7) {
      return `Last ${dayNames[new Date(date).getDay()]}`;
    }
  } else {
    // future branch
    const daysDiff = Math.ceil((date - todayEnd) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      return 'Tomorrow';
    } else if (daysDiff > 1 && daysDiff < 4) {
      return `In ${daysDiff} days`;
    } else if (daysDiff >= 4 && daysDiff < 7) {
      return `Next ${dayNames[new Date(date).getDay()]}`;
    }
  }

  const diff = date < todayStart ? todayStart - date : date - todayEnd;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const day = new Date(date).getDate();
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();
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

  if ((days >= 7 && days < 183) || (days <= -7 && days > -183)) {
    return `${day} ${monthNames[month]}`;
  } else {
    return `${day} ${monthNames[month]} ${year}`;
  }
}
