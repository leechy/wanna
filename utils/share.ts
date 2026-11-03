import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export async function shareList(listId: string) {
  try {
    const result = await Share.share({
      url: shareLink(listId),
    });
    console.log('Share result', result);
  } catch (error) {
    console.error('Error sharing list', error);
  }
}

export async function copyListLinkToClipboard(listId: string) {
  await Clipboard.setStringAsync(shareLink(listId));
}

export function shareLink(shareId: string) {
  return `https://app.wanna-wanna.com/shared/${shareId}`;
}

/**
 * Finds the share id in what the user pasted or scanned:
 * https://app.wanna-wanna.com/shared/<id>, wanna://shared/<id> or the bare id,
 * typed with dashes, spaces or nothing between the groups
 */
export function parseShareId(text: string): string | null {
  const value = text.trim();
  const fromLink = value.match(/\/shared\/([A-Za-z0-9_-]+)/);
  if (fromLink) {
    return fromLink[1];
  }
  const letters = value.toLowerCase().replace(/[\s-]+/g, '');
  return /^[a-z]{21}$/.test(letters) ? letters.match(/.{3}/g)!.join('-') : null;
}
