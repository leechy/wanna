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
export function humanDate(date: number, showTime = false): string {
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todayEnd = todayStart + 1000 * 60 * 60 * 24;

  const newDate = new Date(date);
  let time = '';
  if (showTime) {
    time = ' at ' + newDate.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
  }

  if (date >= todayStart && date < todayEnd) {
    return 'Today' + time;
  }

  // TODO: when localized, use toLocaleString() call
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (date < todayStart) {
    // past branch
    const daysDiff = Math.ceil((todayStart - date) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      return 'Yesterday' + time;
    } else if (daysDiff > 1 && daysDiff < 4) {
      return `${daysDiff} days ago${time}`;
    } else if (daysDiff >= 4 && daysDiff < 7) {
      return `Last ${dayNames[newDate.getDay()]}${time}`;
    }
  } else {
    // future branch
    const daysDiff = Math.ceil((date - todayEnd) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      return 'Tomorrow' + time;
    } else if (daysDiff > 1 && daysDiff < 4) {
      return `In ${daysDiff} days${time}`;
    } else if (daysDiff >= 4 && daysDiff < 7) {
      return `Next ${dayNames[newDate.getDay()]}${time}`;
    }
  }

  const diff = date < todayStart ? todayStart - date : date - todayEnd;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const day = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
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

  if (days < 183 && days > -183 && new Date().getFullYear() === year) {
    return `${day} ${monthNames[month]}${time}`;
  } else {
    return `${day} ${monthNames[month]} ${year}${time}`;
  }
}
