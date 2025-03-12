// hooks and state
import { useThemeColor } from '@/hooks/useThemeColor';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$ } from '@/state/state';
import { deleteList, updateList } from '@/state/actions-lists';
import { router } from 'expo-router';

// components
import { DropdownMenu } from './DropdownMenu';

// icons
import SubmenuIcon from './SubmenuIcon';
import EditIcon from '@/assets/symbols/edit.svg';
import SquareMinusIcon from '@/assets/symbols/square-minus.svg';
import SquareCheckIcon from '@/assets/symbols/square-check.svg';

interface ListMenuProps {
  listId?: string;
}

function ListMenu({ listId }: ListMenuProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const dangerColor = useThemeColor({}, 'danger');

  const list = _lists$[listId || '']?.get();

  if (!listId) {
    return null;
  }

  function editList() {
    router.navigate(`/shopping/new-modal?listId=${listId}`);
  }

  function markListAsCompleted() {
    if (listId) {
      updateList(listId, {
        completed: true,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  function restoreList() {
    if (listId) {
      updateList(listId, {
        completed: false,
        completedAt: undefined,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  function deleteCurrentList() {
    if (listId) {
      router.back();
      deleteList(listId);
    }
  }

  return (
    <DropdownMenu
      items={[
        {
          label: 'Edit list',
          onPress: editList,
          icon: EditIcon,
        },
        {
          label: list?.completed ? 'Restore list' : 'Mark as completed',
          onPress: list?.completed ? restoreList : markListAsCompleted,
          icon: SquareCheckIcon,
        },
        {
          label: 'Delete list',
          onPress: deleteCurrentList,
          color: dangerColor,
          icon: SquareMinusIcon,
        },
      ]}
      width={250}
      isHeaderMenu={true}
    >
      <SubmenuIcon width={24} height={24} color={primaryColor} />
    </DropdownMenu>
  );
}

export default observer(ListMenu);
