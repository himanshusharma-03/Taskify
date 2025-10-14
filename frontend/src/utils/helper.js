export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const addThousandsSeparator = (num) => {
  // Check for null or non-numeric input and return an empty string
  if (num === null || isNaN(num)) return "";

  // Split the number string into integer and fractional parts
  const [integerPart, fractionalPart] = num.toString().split(".");

  // Format the integer part using a regular expression to add commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return the full formatted number, including the fractional part if it exists
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};