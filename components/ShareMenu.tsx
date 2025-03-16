// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { DropdownMenu } from '@/components/DropdownMenu';
import SmallButton from '@/components/SmallButton';

// utilities
import { copyListLinkToClipboard, shareList } from '@/utils/share';

// icons
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import ShareIcon from '@/assets/symbols/share.svg';
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';
import ChevronRightIcon from '@/assets/symbols/chevron-right.svg';

interface ShareMenuProps {
  listId?: string;
  listName?: string;
  shareId?: string;
}

export default function ShareMenu({ listId, listName, shareId }: ShareMenuProps) {
  const touchableColor = useThemeColor({}, 'touchable');

  return (
    <DropdownMenu
      items={[
        {
          label: 'Share link',
          onPress: () => {
            if (shareId) {
              setTimeout(() => {
                shareList(shareId);
              }, 600);
            }
          },
          disabled: !shareId,
          icon: ShareIcon,
        },
        {
          label: 'Copy link',
          onPress: () => {
            if (shareId) {
              copyListLinkToClipboard(shareId);
            }
          },
          disabled: !shareId,
          icon: CopyLinkIcon,
        },
        {
          label: 'Share with',
        },
        {
          label: 'Soulntse',
          onPress: () => {
            console.log('Share list with Soulntse');
          },
          icon: PersonPlusIcon,
        },
        {
          label: 'Vicky',
          onPress: () => {
            console.log('Share list with Vicky');
          },
          icon: PersonPlusIcon,
        },
        {
          label: 'Djawaharlal Nehru the second',
          onPress: () => {
            console.log('Share list with Djawaharlal');
          },
          icon: PersonPlusIcon,
        },
        {
          label: 'Choose contact',
          onPress: () => {
            // @ts-ignore
            router.push({
              pathname: '/shopping/choose-contact',
              params: {
                listId,
                listName,
              },
            });
          },
          disabled: !listId,
          icon: ChevronRightIcon,
          color: touchableColor,
        },
      ]}
    >
      <SmallButton icon={PersonPlusIcon} title="Not shared" />
    </DropdownMenu>
  );
}
