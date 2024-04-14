function isValidText(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

function isValidDate(value) {
  const date = new Date(value);
  return value && date !== 'Invalid Date';
}

function isValidImageUrl(value) {
  return value && value.startsWith('http');
}

function isValidEmail(value) {
  return value && value.includes('@');
}
  
const validatePhoneNumber = (phoneNumber) => {
  const cleanedNumber = phoneNumber.toString();

  const regex = /^(\+?\d{1,3})?(\d{6,15})$/;

  if (cleanedNumber.match(regex)) {
    return true;
  } else {
    return false;
  }
}

exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;
exports.validatePhoneNumber = validatePhoneNumber;