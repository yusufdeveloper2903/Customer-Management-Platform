// users
export interface UserListResults {
  id: number;
  name: string | null;
  phone: string;
  username: string | null;
  is_active: boolean;
  role: Role[];
}

export interface UserList {
  count: number;
  next: number | null;
  previous: number | null;
  results: UserListResults[];
}

export interface CarShowroom {
  name: string | null;
  bank_requisite: string | null;
  settlement_account: string | null;
  inn: string | null;
  mfo: string | null;
  oked: string | null;
  address: string | null;
  company_name: string | null;
}
// single user
export interface User {
  id: number | null;
  name: string | null;
  phone: string;
  password: null;
  username: string | null;
  is_active: boolean;
  role: Role[] | any;
  regions: any;
  photo: string | null;
  date_of_birth: string | null;
  pinfl: string | null;
  passport_data: string;
  car_showroom: CarShowroom;
}

// roles
export interface RoleLangs {
  ru: string | null;
  uz: string | null;
}

export interface Role {
  id: number;
  name: RoleLangs;
}

export interface UserRolesListResults {
  id: number;
  name: RoleLangs | object;
}

export interface UsersRolesList {
  count: number;
  next: number | null;
  previous: number | null;
  results: UserRolesListResults | [];
}

// regions
export interface RegionLangs {
  ru: string | null;
  uz: string | null;
}

export interface RegionParents {
  id: number;
  name: RegionLangs | string;
  is_active: boolean;
}

export interface RegionsResults {
  id: number;
  name: RegionLangs | string;
  is_active: boolean;
  parent: RegionParents | null;
}

export interface Regions {
  count: number;
  next: number | null;
  previous: number | null;
  results: RegionsResults | [];
}

export interface userCards {
  user_id: number;
  number: string | any;
  exp_date: string;
  title: string;
  length: number;
}
