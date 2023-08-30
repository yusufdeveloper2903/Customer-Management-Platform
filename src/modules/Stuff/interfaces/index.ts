// users
export interface IStuffListResults {
  id: number;
  name: string | null;
  phone: string;
  username: string | null;
  is_active: boolean;
  role: Role[];
}

export interface IStuffList {
  count: number;
  next: number | null;
  previous: number | null;
  results: IStuffListResults[];
}

export interface RoleLangs {
  ru: string | null;
  uz: string | null;
}

export interface Role {
  id: number;
  name: RoleLangs;
}
