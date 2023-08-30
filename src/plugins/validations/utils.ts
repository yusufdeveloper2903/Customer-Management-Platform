interface ValidateValue {
  minLength?: number | string;
  maxLength?: number | string;
  minValue?: number | string;
  maxValue?: number | string;
}

export const validateMessage = (
  type: string = "required",
  value?: ValidateValue
) => {
  let message = {
    required: "required",
    minLength: `Минимальная длина ${value?.minLength} символов`,
    maxLength: `Максимальная длина ${value?.maxLength} символов`,
    minValue: `Минимальная значение ${value?.minValue}`,
    maxValue: `Максимальная значение ${value?.maxValue}`,
  };
  return message[type];
};
