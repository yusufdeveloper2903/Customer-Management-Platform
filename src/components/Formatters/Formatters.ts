export function formatPhoneNumber(phoneNumber: any) {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
    const formattedPhoneNumber = cleanedPhoneNumber.replace(
        /^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
        "+$1 $2 $3 $4 $5"
    );
    return formattedPhoneNumber.trim();
}
