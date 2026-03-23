// =====================================================
// AUY Student Portal - Helper Functions
// =====================================================

/**
 * Format a date string to a more readable format
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return formatDate(dateStr);
}

/**
 * Calculate GPA from grade points
 */
export function calculateGPA(gpaPoints: string[]): string {
  const validPoints = gpaPoints.filter(p => p && !isNaN(parseFloat(p)));
  if (validPoints.length === 0) return '0.00';
  
  const sum = validPoints.reduce((acc, p) => acc + parseFloat(p), 0);
  return (sum / validPoints.length).toFixed(2);
}

/**
 * Get grade color based on grade letter
 */
export function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50';
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
  if (grade.startsWith('C')) return 'text-amber-600 bg-amber-50';
  if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
  if (grade === 'F') return 'text-red-600 bg-red-50';
  return 'text-gray-600 bg-gray-50';
}

/**
 * Calculate attendance percentage
 */
export function calculateAttendanceRate(
  attendance: { status: string }[]
): number {
  if (attendance.length === 0) return 0;
  const presentCount = attendance.filter(
    a => a.status === 'Present' || a.status === 'Late'
  ).length;
  return Math.round((presentCount / attendance.length) * 100);
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

/**
 * Get days until a date
 */
export function getDaysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format time string (24h to 12h)
 */
export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate a random pastel color
 */
export function getRandomPastelColor(): string {
  const colors = [
    'bg-red-100',
    'bg-orange-100',
    'bg-amber-100',
    'bg-yellow-100',
    'bg-lime-100',
    'bg-green-100',
    'bg-emerald-100',
    'bg-teal-100',
    'bg-cyan-100',
    'bg-sky-100',
    'bg-blue-100',
    'bg-indigo-100',
    'bg-violet-100',
    'bg-purple-100',
    'bg-fuchsia-100',
    'bg-pink-100',
    'bg-rose-100',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
