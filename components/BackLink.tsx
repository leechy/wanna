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
  shopping: 'All shopping lists',
  projects: 'All projects',
};

interface BackLinkProps {
  parentTitle?: string;
  listId?: string;
  noTitle?: boolean;
  noIcon?: boolean;
  path?: '/' | '/wishes' | '/shopping' | '/projects';
  // where to go when there is no screen to go back to, e.g. a modal opened by a link
  fallbackPath?: '/' | '/wishes' | '/shopping' | '/projects';
}

export function BackLink({ parentTitle, listId, noTitle = false, noIcon = false, path, fallbackPath }: BackLinkProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const backButtonColor = primaryColor + 'bb';

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

  if (!router.canGoBack() && !fallbackPath) {
    return null;
  }

  return (
    <HeaderButton
      title={noTitle ? '' : title}
      color={backButtonColor}
      icon={noIcon ? undefined : Platform.OS === 'android' ? ArrowLeftIcon : ChevronLeftIcon}
      style={Platform.OS === 'android' ? { gap: 8, paddingLeft: 8 } : {}}
      // @ts-ignore
      onPress={() => {
        if (path) {
          if (router.canDismiss()) {
            router.dismissTo(path);
          } else {
            router.replace(path);
          }
        } else if (router.canGoBack()) {
          router.back();
        } else if (router.canDismiss()) {
          router.dismiss();
        } else if (fallbackPath) {
          router.replace(fallbackPath);
        }
      }}
    />
  );
}
