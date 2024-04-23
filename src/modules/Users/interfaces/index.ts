// USER TYPE INTERFACES


export interface UserListResults {
    id: number;
    full_name: string | null;
    phone: string;
    last_login: string
    is_active: boolean;
    created_date: string;
}

export interface params {
    page: number;
    page_size: number;
    search: string | null;
}


export interface UserList {
    count: number;
    next: number | null;
    previous: number | null;
    results: UserListResults[];
}

// single user
export interface User {
    id: number | null;
    sessions: Sessions[];
    created_date: string;
    modified_date: string;
    full_name: string | null;
    phone: string | null;
    last_login: string,
}

export interface Sessions {
    operation_version: string;
    ip_address: string;
    last_visit: string;
    device_type: string;
    created_date: string;
    device_id: string;
    is_active: boolean;
    device_model: string
}

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

