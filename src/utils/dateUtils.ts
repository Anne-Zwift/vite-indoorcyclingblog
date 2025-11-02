/**
 * Formats an ISO 8601 date string into a readable relative format.
 * If the date is older than 7 days, it returns a standard short date format.
 * @param {string} dateString - The ISO 8601 date string.
 * @returns {string} The formatted date string.
 */

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInDays = Math.floor(diffInSeconds / (60 * 60 * 24));

  if (diffInDays < 1) {
    return 'Today';
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}