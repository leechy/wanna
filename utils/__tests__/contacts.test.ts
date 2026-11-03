import { getContacts } from '../contacts';
import { List } from '@/types/list';

const list = (listId: string, uids: string[], extra: Partial<List> = {}) =>
  ({ listId, deleted: false, users: uids.map((uid) => ({ uid, names: uid.toUpperCase() })), ...extra }) as List;

describe('getContacts', () => {
  const lists = [
    list('home', ['me', 'masha', 'vicky']),
    list('party', ['me', 'masha']),
    list('work', ['me', 'bob']),
    list('old', ['me', 'zoe'], { deleted: true }),
  ];

  it('lists the people with the most shared lists first, without the user', () => {
    expect(getContacts(lists, 'me')).toEqual([
      { uid: 'masha', names: 'MASHA', sharedLists: 2 },
      { uid: 'bob', names: 'BOB', sharedLists: 1 },
      { uid: 'vicky', names: 'VICKY', sharedLists: 1 },
    ]);
  });

  it('leaves out the members and the invited of the list', () => {
    const target = list('new', ['me', 'bob'], { invited: [{ uid: 'vicky', names: 'VICKY' }] });
    expect(getContacts([...lists, target], 'me', target).map((c) => c.uid)).toEqual(['masha']);
  });
});
