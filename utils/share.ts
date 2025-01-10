import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export async function shareList(listId: string) {
  try {
    const result = await Share.share({
      url: `https://app.wanna-wanna.com/shared/${listId}`,
    });
    console.log('Share result', result);
  } catch (error) {
    console.error('Error sharing list', error);
  }
}

export async function copyListLinkToClipboard(listId: string) {
  await Clipboard.setStringAsync(`https://app.wanna-wanna.com/shared/${listId}`);
}
