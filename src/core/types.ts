export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  author?: string;
  hasCoverImage: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Pet = {
  id: string;
  customer_id: string;
  name: string;
  breed: string | null;
  age: number | null;
  notes: string | null;
  created_at: string;
};

export type BookingRequest = {
  id: string;
  customer_id: string | null;
  start_date: string;
  end_date: string;
  county: string;
  status: 'PENDING_SITTER_ACCEPTANCE' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED_UNCLAIMED' | 'CANCELED_BY_ADMIN' | 'COMPLETED';
  assigned_sitter_id: string | null;
  total_cost_cents: number | null;
  base_rate_at_booking_cents: number | null;
  discount_applied_cents: number | null;
  addons_total_cost_cents: number | null;
  payment_status: 'UNPAID' | 'PAID' | 'REFUNDED';
  amount_paid_cents: number;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
};