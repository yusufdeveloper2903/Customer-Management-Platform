export function formatCreditCardNumber(cardNumber) {
  const cleanedCardNumber = cardNumber.replace(/\D/g, "");
  const formattedCardNumber = cleanedCardNumber.replace(/(\d{4})/g, "$1 ");
  return formattedCardNumber.trim();
}

export function formatPhoneNumber(phoneNumber) {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
  const formattedPhoneNumber = cleanedPhoneNumber.replace(
    /^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
    "+$1 $2 $3 $4 $5"
  );

  return formattedPhoneNumber.trim();
}

export function removeSpaces(str) {
  return str.replace(/[\s+]/g, "");
}
