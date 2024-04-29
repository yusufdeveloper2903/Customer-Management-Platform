export const objectToFormData = (obj: any) => {
    const formData = new FormData();
    for (const property in obj) {
        console.log(obj[property], 'ob')
        if (property == 'file' || property == 'photo') {
            if (obj[property] == null) {
                formData.append(property, '');
            } else if (typeof obj[property] == 'string') {  // DOES NOT CUT THIS PART IT'S IMPORTANT TO VALIDATION
                // formData.append(property, '');
            } else {
                formData.append(property, obj[property]);
            }
        } else if (obj[property] == null) {
            // formData.append(property, obj[property]);
        } else {
            formData.append(property, obj[property]);
        }
    }
    return formData;
};
