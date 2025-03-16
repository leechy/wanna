// hooks
import { useMemo } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, useSegments } from 'expo-router';

// state
import { lists$ as _lists$ } from '@/state/state';

// components
import HeaderButton from '@/components/HeaderButton';
import ChevronLeftIcon from '@/assets/symbols/chevron-left.svg';
import ArrowLeftIcon from '@/assets/symbols/arrow-left.svg';
import { Platform } from 'react-native';

const routeTitles: { [segment: string]: string } = {
  home: 'Current Wishes',
  shopping: 'Shopping lists',
  projects: 'Projects',
};

interface BackLinkProps {
  parentTitle?: string;
  listId?: string;
}

export function BackLink({ parentTitle, listId }: BackLinkProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const backButtonColor = primaryColor + '80';

  const segments = useSegments();
  const parent = segments[segments.length - 2];

  const title = useMemo(() => {
    if (parentTitle) {
      return parentTitle;
    }
    if (listId) {
      return _lists$[listId]?.get()?.name || routeTitles.home;
    }
    if (routeTitles[parent]) {
      return routeTitles[parent];
    }
    return routeTitles.home;
  }, [parentTitle, parent, listId]);

  if (!router.canGoBack()) {
    return null;
  }

  return (
    <HeaderButton
      title={title}
      color={backButtonColor}
      icon={Platform.OS === 'android' ? ArrowLeftIcon : ChevronLeftIcon}
      style={Platform.OS === 'android' ? { gap: 8 } : {}}
      // @ts-ignore
      onPress={() => router.dismiss()}
    />
  );
}
