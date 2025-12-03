export type RemoteRequest = {
  request_id: number;
  user_id: number;
  user_name: string;
  request_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_by?: number;
  approved_at?: string;
  accept_reason?: string;
  rejected_by?: number;
  rejected_at?: string;
  rejection_reason?: string;
  approved_by_name?: string;
};
