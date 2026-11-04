import { router } from 'expo-router';
import { isWideNow } from '@/hooks/useLayout';
import { lists$, ui$ } from '@/state/state';

/**
 * Opens a list.
 * On a narrow screen it goes on top of the home screen, as before.
 * On a wide screen it takes the place of the list on the right:
 * the popups of the previous list are closed and the stack is only "home → this list",
 * so turning the device back to narrow leaves the back button to the home screen
 *
 * @param {string} listId  list to open
 */
export function openList(listId: string) {
  const href = { pathname: '/shopping/[list]', params: { list: listId } } as const;
  if (!isWideNow()) {
    router.navigate(href);
    return;
  }
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.push(href);
}

/**
 * The list to show next to the home screen when nothing else asks for one:
 * the last list the user worked with, or the first one on the home screen
 *
 * @returns {string | null}
 */
export function defaultListId(): string | null {
  const lists = lists$.peek() ?? {};
  const isOpen = (id: string | null | undefined) =>
    !!id && !!lists[id] && !lists[id].deleted && lists[id].type === 'shopping-list';

  const lastListId = ui$.lastListId.peek();
  if (isOpen(lastListId)) {
    return lastListId;
  }

  const first = Object.values(lists)
    .filter((list) => isOpen(list.listId) && !list.completed)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))[0];
  return first?.listId ?? null;
}
