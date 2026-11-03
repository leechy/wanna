// hooks
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSelector } from '@legendapp/state/react';
import { lists$ as _lists$, user$ as _user$ } from '@/state/state';

// components
import { DropdownMenu } from '@/components/DropdownMenu';
import SmallButton from '@/components/SmallButton';

// utilities
import { copyListLinkToClipboard, shareList } from '@/utils/share';
import { getContacts } from '@/utils/contacts';
import { inviteToList } from '@/state/actions-invitations';
import { router } from 'expo-router';

// types
import { DropdownItem } from '@/types/DropdownItem';

// icons
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import PersonaIcon from '@/assets/symbols/persona.svg';
import TwoPersonasIcon from '@/assets/symbols/two-personas.svg';
import ShareIcon from '@/assets/symbols/share.svg';
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';
import QrCodeIcon from '@/assets/symbols/qr-code.svg';
import ChevronRightIcon from '@/assets/symbols/chevron-right.svg';

interface ShareMenuProps {
  listId?: string;
  listName?: string;
  shareId?: string;
}

// the people with the most shared lists, right in the menu, the others are on the contacts screen
const MENU_CONTACTS = 3;

/**
 * Sharing a list: links for anyone new, invitations for the people the user shares other lists with.
 * A list of one starts with the links, a shared list starts with its members.
 */
export default function ShareMenu({ listId, listName, shareId }: ShareMenuProps) {
  const touchableColor = useThemeColor({}, 'touchable');

  const uid = useSelector(() => _user$.uid?.get());
  const list = useSelector(() => (listId ? _lists$[listId]?.get() : undefined));
  const contacts = useSelector(() =>
    uid ? getContacts(Object.values(_lists$.get() ?? {}), uid, list) : []
  );

  const members = list?.users ?? [];
  const invited = list?.invited ?? [];
  const isShared = members.length > 1;

  const linkItems: DropdownItem[] = [
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
  ];

  const contactsScreenItem = (label: string): DropdownItem => ({
    label,
    onPress: () => {
      if (listId) {
        router.push({ pathname: '/contacts/[listId]', params: { listId } });
      }
    },
    disabled: !listId,
    icon: ChevronRightIcon,
    color: touchableColor,
  });

  // nobody can be taken out of the list, the names are just shown
  const memberItems: DropdownItem[] = [
    { label: 'In this list' },
    ...members.map((member) => ({
      label: member.uid === uid ? `${member.names} (you)` : member.names,
      onPress: () => {},
      disabled: true,
      icon: PersonaIcon,
    })),
    ...invited.map((user) => ({
      label: `${user.names} · invited`,
      onPress: () => {},
      disabled: true,
      icon: PersonaIcon,
    })),
  ];

  const inviteItems: DropdownItem[] = contacts.length
    ? [
        { label: 'Share with' },
        ...contacts.slice(0, MENU_CONTACTS).map((contact) => ({
          label: contact.names,
          onPress: () => {
            if (listId) {
              inviteToList(listId, contact);
            }
          },
          icon: PersonPlusIcon,
        })),
        ...(contacts.length > MENU_CONTACTS ? [contactsScreenItem('More people')] : []),
      ]
    : [];

  const items = isShared
    ? [...memberItems, { label: 'Invite' }, ...linkItems, contactsScreenItem('Share with')]
    : [...linkItems, ...inviteItems];

  return (
    <DropdownMenu items={items}>
      {isShared ? (
        <SmallButton icon={TwoPersonasIcon} title={`${members.length} people`} />
      ) : (
        <SmallButton icon={PersonPlusIcon} title={invited.length ? `${invited.length} invited` : 'Not shared'} />
      )}
    </DropdownMenu>
  );
}
