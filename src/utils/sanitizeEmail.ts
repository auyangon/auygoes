export const sanitizeEmail = (email: string): string => {
  return email.replace(/\./g, ',,,');
};
