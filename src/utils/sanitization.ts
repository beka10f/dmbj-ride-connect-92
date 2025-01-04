import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  // Remove any HTML tags and sanitize the input
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.trim().length > 0 && emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phone.trim().length > 0 && phoneRegex.test(phone);
};

export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    }
  });
  return sanitized;
};