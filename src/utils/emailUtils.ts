// src/utils/emailUtils.ts
// Firebase doesn't allow dots in paths, so we encode emails
export const encodeEmailForFirebase = (email: string): string => {
  if (!email) return '';
  // Replace dots with commas (Firebase safe)
  return email.replace(/\./g, ',');
};

// Decode back to original email (if needed)
export const decodeEmailFromFirebase = (encoded: string): string => {
  if (!encoded) return '';
  return encoded.replace(/,/g, '.');
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

