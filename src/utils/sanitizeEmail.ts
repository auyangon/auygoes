// src/utils/sanitizeEmail.ts
// WARNING: Only use this if your Firebase actually has sanitized keys!
// From your screenshot, you DON'T need this - emails are stored with dots
export const sanitizeEmail = (email: string): string => {
  // If your Firebase has dots replaced with commas, uncomment this:
  // return email.replace(/\./g, ',');
  
  // But from your screenshot, just return the email as-is
  return email;
};
