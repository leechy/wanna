// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { DropdownMenu } from '@/components/DropdownMenu';
import SmallButton from '@/components/SmallButton';

// utilities
import { copyListLinkToClipboard, shareList } from '@/utils/share';
import { router } from 'expo-router';

// icons
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import TwoPersonasIcon from '@/assets/symbols/two-personas.svg';
import ShareIcon from '@/assets/symbols/share.svg';
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';
import QrCodeIcon from '@/assets/symbols/qr-code.svg';
import ChevronRightIcon from '@/assets/symbols/chevron-right.svg';

interface ShareMenuProps {
  listId?: string;
  listName?: string;
  shareId?: string;
  membersCount?: number;
}

export default function ShareMenu({ listId, listName, shareId, membersCount = 0 }: ShareMenuProps) {
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
          label: 'Show QR code',
          onPress: () => {
            if (shareId) {
              router.push({ pathname: '/qr/[shareId]', params: { shareId, name: listName ?? '' } });
            }
          },
          disabled: !shareId,
          icon: QrCodeIcon,
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
      {membersCount > 1 ? (
        <SmallButton icon={TwoPersonasIcon} title={`${membersCount} people`} />
      ) : (
        <SmallButton icon={PersonPlusIcon} title="Not shared" />
      )}
    </DropdownMenu>
  );
}
