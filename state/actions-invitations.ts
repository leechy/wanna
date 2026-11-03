import { Invitation } from '@/types/list';
import { invitations$ as _invitations$, lists$ as _lists$ } from './state';
import { queueOperation } from './actions-queue';

/**
 * Replaces the invitations with the ones from the server
 *
 * @param {Invitation[]} invitations  all the pending invitations of the user
 */
export function setInvitations(invitations: Invitation[]) {
  _invitations$.set(Object.fromEntries(invitations.map((invitation) => [invitation.listId, invitation])));
}

export function addInvitation(invitation: Invitation) {
  _invitations$[invitation.listId].set(invitation);
}

export function removeInvitation(listId: string) {
  _invitations$[listId].delete();
}

export function clearInvitations() {
  _invitations$.set({});
}

/**
 * Invites someone the user shares another list with,
 * they show as invited right away, the server confirms with the list update
 *
 * @param {string} listId  list id
 * @param {{ uid: string; names: string }} user  the invited user
 */
export function inviteToList(listId: string, user: { uid: string; names: string }) {
  const invited = _lists$[listId].invited.peek() ?? [];
  if (!invited.some((u) => u.uid === user.uid)) {
    _lists$[listId].invited.set([...invited, user]);
  }
  queueOperation('list:invite', { listId, uid: user.uid });
}
