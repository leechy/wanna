import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * The app has only light and dark themes, "unspecified" falls back to light
 */
export function useColorScheme(): 'light' | 'dark' {
  return useRNColorScheme() === 'dark' ? 'dark' : 'light';
}
