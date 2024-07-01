export interface Login {
    username: string;
    password: string;
}

export interface ListInterface {
    title: string,
    active: boolean
}

export interface ReturnValue {
    item: string;
    index: number;
}

export interface FileInput {
    lastModified: number
    lastModifiedDate: object
    name: string
    size: number
    type: string
    webkitRelativePath: string
}


export interface IResponse<T> {
    count: number;
    page: number
    page_size: number
    next: number | null
    results: T[];
}
