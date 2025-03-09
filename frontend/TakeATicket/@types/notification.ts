export interface INotification {
  id?: string;
  ticket_id: string;
  user_id: string;
  admin_id: string;
  status: string;
  created_at?: string;
}
