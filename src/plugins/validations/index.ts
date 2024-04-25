// 👉 IsEmpty
export const isEmpty = value => {
    if (value === null || value === undefined || value === '')
        return true

    return !!(Array.isArray(value) && value.length === 0)
}

// 👉 IsNullOrUndefined
export const isNullOrUndefined = value => {
    return value === null || value === undefined
}

// 👉 IsEmptyArray
export const isEmptyArray = arr => {
    return Array.isArray(arr) && arr.length === 0
}
