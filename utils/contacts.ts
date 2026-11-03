import { List, ListUser } from '@/types/list';

export type Contact = ListUser & {
  // how many lists the user shares with them
  sharedLists: number;
};

/**
 * The people the user shares lists with, the ones with the most shared lists first
 *
 * @param {List[]} lists  the user's lists
 * @param {string} uid  the user, not a contact of their own
 * @param {List} [forList]  leaves out who is in this list or invited to it already
 * @returns {Contact[]}
 */
export function getContacts(lists: List[], uid: string, forList?: List): Contact[] {
  const contacts = new Map<string, Contact>();

  lists
    .filter((list) => !list.deleted)
    .forEach((list) => {
      list.users?.forEach((user) => {
        if (user.uid === uid) return;
        const contact = contacts.get(user.uid);
        if (contact) {
          contact.sharedLists += 1;
        } else {
          contacts.set(user.uid, { ...user, sharedLists: 1 });
        }
      });
    });

  const taken = new Set([...(forList?.users ?? []), ...(forList?.invited ?? [])].map((user) => user.uid));

  return [...contacts.values()]
    .filter((contact) => !taken.has(contact.uid))
    .sort((a, b) => b.sharedLists - a.sharedLists || a.names.localeCompare(b.names));
}
