/**
 * Formats a date string into a more readable format.
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "Jan 1, 2026")
 */
export const formatDate = (dateString: string | Date): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};
