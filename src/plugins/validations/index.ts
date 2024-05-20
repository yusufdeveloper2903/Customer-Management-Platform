// 👉 IsEmpty
export const isEmpty = (value: any) => {
    if (value === null || value === undefined || value === '')
        return true

    return !!(Array.isArray(value) && value.length === 0)
}

// 👉 IsNullOrUndefined
export const isNullOrUndefined = (value: any) => {
    return value === null || value === undefined
}

// 👉 IsEmptyArray
export const isEmptyArray = (arr: any) => {
    return Array.isArray(arr) && arr.length === 0
}
