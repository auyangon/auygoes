/**
 * Convert email to valid Firebase key (replace dots with ,,,)
 */
export function sanitizeEmail(email: string): string {
  return email.replace(/\./g, ',,,');
}
