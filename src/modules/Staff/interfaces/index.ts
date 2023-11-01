export interface Results<T> {
  // data: {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
  // }
}

export interface IStaff {
  id: number;
  full_name: string | null;
  phone: string | null;
  username: string | null;
  is_active: boolean;
  role: string | null
}

export interface UsersRoles {
  
}
