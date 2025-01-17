export type List = {
  id: string;
  share_id: string;
  name: string;
  type: 'project' | 'shopping-list';
  deadline: string | null;
  is_active: boolean;
  hide_completed: boolean;
  notify_on_list_items_update: boolean;
  notify_on_item_state_update: boolean;
  notify_on_user_at_location: boolean;
  user_ids: string[];
  created_at: string;
  updated_at: string;
  deleted: boolean;
};
