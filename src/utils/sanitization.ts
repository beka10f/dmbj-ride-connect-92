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
  return email.trim().length > 0 && emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phone.trim().length > 0 && phoneRegex.test(phone);
};

export const sanitizeFormData = <T extends Record<string, any>>(data: T): Partial<T> => {
  const sanitized: Partial<T> = {};
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      sanitized[key as keyof T] = sanitizeInput(data[key]) as T[keyof T];
    } else {
      sanitized[key as keyof T] = data[key];
    }
  });
  return sanitized;
};