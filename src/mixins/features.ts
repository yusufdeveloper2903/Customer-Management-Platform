export function formatCreditCardNumber(cardNumber: string): string {
  const cleanedCardNumber = cardNumber.replace(/\D/g, "");
  const formattedCardNumber = cleanedCardNumber.replace(/(\d{4})/g, "$1 ");
  return formattedCardNumber.trim();
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
  const formattedPhoneNumber = cleanedPhoneNumber.replace(
    /^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
    "+$1 $2 $3 $4 $5"
  );

  return formattedPhoneNumber.trim();
}

export function removeSpaces(str: string): string {
  return str.replace(/[\s+]/g, "");
}

export function formatCurrency(amount: number): string {
  // const roundedAmount = Math.round(amount * 100) / 100;
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
  // const hours = date.getHours().toString().padStart(2, "0");
  // const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year}`;
}

export function fillCorrectColor(color: string): string {
  const colors = {
    info: "bg-info/10",
    warning: "bg-warning/10",
    success: "bg-success/10",
    danger: "bg-danger/10",
    primary: "bg-primary/10",
  };

  return colors[color];
}
