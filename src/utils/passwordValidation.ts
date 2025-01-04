export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireNumbers: true,
  requireSpecialChars: true,
  requireUppercase: true,
};

export const validatePassword = (password: string) => {
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return "Password must be at least 8 characters long";
  }
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*)";
  }
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  return null;
};