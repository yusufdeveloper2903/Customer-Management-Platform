export type UserData = {
  id: number;
  username: string | null;
  is_superuser: boolean;
  language: string | null;
  theme: string | null;
  role: Role[];
  photo: string | null;
  address: string;
  name: string | null;
};

export type Role = {
  id: number;
  name: object;
  unique_name: string;
};
