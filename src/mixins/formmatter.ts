export const objectToFormData = (photo: any, obj: any) => {
    const formData = new FormData();
    for (const property in obj) {
        if (photo.includes(property)) {
            for (const i of photo) {
                if (property == i) {
                    if (obj[property] == null) {
                        formData.append(property, '');
                    } else if (typeof obj[property] == 'string') {  // DOES NOT CUT THIS PART IT'S IMPORTANT TO VALIDATION
                        // formData.append(property, '');
                    } else {
                        formData.append(property, obj[property]);
                    }
                }
            }
        } else if (obj[property] == null ) {
            // formData.append(property, obj[property]);
        } else {
            formData.append(property, obj[property]);
        }
    }
    return formData;
};
