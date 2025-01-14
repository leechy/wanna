import { useThemeColor } from '@/hooks/useThemeColor';
import { DropdownMenu } from './DropdownMenu';
import SubmenuIcon from './SubmenuIcon';
import EditIcon from '@/assets/symbols/edit.svg';
import SquareMinusIcon from '@/assets/symbols/square-minus.svg';

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
            console.log('Edit list', listId);
          },
          icon: EditIcon,
        },
        {
          label: 'Delete list',
          onPress() {
            console.log('Delete list', listId);
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
