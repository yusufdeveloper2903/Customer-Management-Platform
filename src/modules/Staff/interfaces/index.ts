export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
}

export interface StaffDetails {
  id: number | null;
  role: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  username: string | null;
  language: string | null;
  theme: string | null;
  photo?: string | null;
  is_active: boolean;
  show_password: string | null;
}
