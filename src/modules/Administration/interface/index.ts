//INTERFACES
export interface Params {
    page?: number | string;
    page_size?: number | string;
    total?: number | string;
    search?: string;
    pre_payment?: number | null;
    parent?: number | null;
}

export interface Regions {
    id?: number;
    name?: string;
    is_active?: boolean;
    parent?: {
        id: number;
        name?: string;
        is_active?: boolean
    };
}

export interface DeleteId {
    id: number;
}

export interface Districts {
    id: number;
    name?: string;
    is_active?: boolean;
    parent?: {
        id: number;
        name?: string;
        is_active?: boolean
    };
}

export interface CarModels {
    id: number;
    name?: string;
    is_active?: boolean;
}

export interface CarColors {
    id: number;
    name?: string;
    is_active?: boolean;
    model?: {
        id: number;
        name?: string;
        is_active?: boolean
    };
}

export interface CarBodyTypes {
    id: number;
    name?: string;
    is_active?: boolean;
}

export interface CarFuelTypes {
    id: number;
    name?: string;
    is_active?: boolean;
}

export interface BankRequisites {
    id: number;
    name?: string;
    phone_number?: string;
    mfo?: string;
    settlement_account?: string;
    is_active?: boolean;
}

export interface BackUpList {
    author: object;
    created_at: string;
    file_path: string;
    id: number;
    title: string;
}

export interface backUpMedialist {
    author: object;
    created_at: string;
    file_path: string;
    id: number;
    title: string;
}

export interface journalAuthorizationList {
    datetime: string,
    ip_address: string
    mac_address: string
    method: string
    request: string
    user: object
}

export interface journalActivitiesList {
    datetime: string,
    ip_address: string
    mac_address: string
    method: string
    request: string
    user: object
}