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

