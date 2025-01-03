// FILE: __tests__/dates.test.ts

import { humanDate } from '../dates';

describe('humanDate', () => {
  const now = Date.now();
  const oneDay = 1000 * 60 * 60 * 24;

  test('should return "2 days ago" for a date two day before today', () => {
    const date = now - oneDay - oneDay;
    expect(humanDate(date)).toBe('2 days ago');
  });

  test('should return "Yesterday" for a date one day before today', () => {
    const date = now - oneDay;
    expect(humanDate(date)).toBe('Yesterday');
  });

  test('should return "Today" for the current date', () => {
    expect(humanDate(now)).toBe('Today');
  });

  test('should return "Tomorrow" for a date one day after today', () => {
    const date = now + oneDay;
    expect(humanDate(date)).toBe('Tomorrow');
  });

  test('should return "In 2 days" for a date two days after today', () => {
    const date = now + 2 * oneDay;
    expect(humanDate(date)).toBe('In 2 days');
  });

  test('should return "In 3 days" for a date three days after today', () => {
    const date = now + 3 * oneDay;
    expect(humanDate(date)).toBe('In 3 days');
  });

  test('should return the correct day of the week for the next occurrence', () => {
    const in5Days = new Date(now);
    in5Days.setDate(in5Days.getDate() + 5);
    expect(humanDate(in5Days.getTime())).toBe(
      'Next ' + in5Days.toLocaleString('en', { weekday: 'long' })
    );
  });

  test('should return the date in format DD MMMM YYYY for a date more than 6 months away', () => {
    const futureDate = new Date(now);
    futureDate.setMonth(futureDate.getMonth() + 7);
    const expectedDate = `${futureDate.getDate()} ${futureDate.toLocaleString(
      'en',
      { month: 'long' }
    )} ${futureDate.getFullYear()}`;
    expect(humanDate(futureDate.getTime())).toBe(expectedDate);
  });
});
