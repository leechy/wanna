import { parseShareId } from '../share';

jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));

describe('parseShareId', () => {
  it('takes the id from the app link', () => {
    expect(parseShareId('https://app.wanna-wanna.com/shared/juz-kig-sib-vin-ted-dob-zip')).toBe(
      'juz-kig-sib-vin-ted-dob-zip'
    );
  });

  it('takes the id from the app scheme link and a link inside a message', () => {
    expect(parseShareId('wanna://shared/juz-kig-sib-vin-ted-dob-zip')).toBe('juz-kig-sib-vin-ted-dob-zip');
    expect(parseShareId('Join my list: https://app.wanna-wanna.com/shared/juz-kig-sib-vin-ted-dob-zip ')).toBe(
      'juz-kig-sib-vin-ted-dob-zip'
    );
  });

  it('accepts the bare id', () => {
    expect(parseShareId('  JUZ-kig-sib-vin-ted-dob-zip\n')).toBe('juz-kig-sib-vin-ted-dob-zip');
  });

  it('accepts the id typed with spaces or without separators', () => {
    expect(parseShareId('Juz kig sib vin ted dob zip')).toBe('juz-kig-sib-vin-ted-dob-zip');
    expect(parseShareId('juzkigsibvinteddobzip')).toBe('juz-kig-sib-vin-ted-dob-zip');
  });

  it('rejects anything else', () => {
    expect(parseShareId('')).toBeNull();
    expect(parseShareId('milk')).toBeNull();
    expect(parseShareId('juz-kig-sib')).toBeNull();
    expect(parseShareId('https://example.com/lists/123')).toBeNull();
  });
});
