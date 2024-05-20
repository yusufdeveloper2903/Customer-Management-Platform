export function formatPhoneNumber(phoneNumber: string): string {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
  const formattedPhoneNumber = cleanedPhoneNumber.replace(
    /^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
    "+$1 $2 $3 $4 $5"
  );
  return formattedPhoneNumber.trim();
}
export function formatCurrency(amount: number): string {
  const roundedAmount = Math.floor(amount);
  const formattedAmount = roundedAmount.toLocaleString();
  const formattedCurrency = formattedAmount;
  return formattedCurrency;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`;
}
