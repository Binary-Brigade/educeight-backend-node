export const passwordValidate = (password) => {
  if (password.length < 8) {
    return false;
  }
  const hasUppercase = /[A-Z]/.test(password); //check for uppercase letter
  const hasLowercase = /[a-z]/.test(password); //check for lowercase letter
  const hasNumber = /[0-9]/.test(password); //check for a number
  const hasSpecialChar = /[!@#$%^&*]/.test(password); ///check for a special char
  if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
    return false;
  }
  // If the password passes all checks, return true
  return true;
}