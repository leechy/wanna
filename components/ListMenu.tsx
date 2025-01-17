import { useThemeColor } from '@/hooks/useThemeColor';
import { DropdownMenu } from './DropdownMenu';
import SubmenuIcon from './SubmenuIcon';
import EditIcon from '@/assets/symbols/edit.svg';
import SquareMinusIcon from '@/assets/symbols/square-minus.svg';
import { router } from 'expo-router';
import { deleteList } from '@/state/actions-lists';

interface ListMenuProps {
  listId?: string;
}

export default function ListMenu({ listId }: ListMenuProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const dangerColor = useThemeColor({}, 'danger');

  if (!listId) {
    return null;
  }

  return (
    <DropdownMenu
      items={[
        {
          label: 'Edit list',
          onPress: () => {
            router.navigate(`/shopping/new-list?listId=${listId}`);
          },
          icon: EditIcon,
        },
        {
          label: 'Delete list',
          onPress() {
            router.back();
            deleteList(listId);
          },
          color: dangerColor,
          icon: SquareMinusIcon,
        },
      ]}
      isHeaderMenu={true}
    >
      <SubmenuIcon width={24} height={24} color={primaryColor} />
    </DropdownMenu>
  );
}
