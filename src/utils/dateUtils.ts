/**
 * Formats a date object or date string to the format "M/D/YYYY, H:MM:SS AM/PM"
 * Example: "2/15/2026, 10:22:55 AM"
 *
 * @param date - The date to format (defaults to current date if not provided)
 * @returns Formatted date string
 */
export const formatDate = (date?: Date | string | null): string => {
    if (!date) {
        return new Date().toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    }

    // Convert to Date object if it's a string
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        console.warn(`Invalid date provided to formatDate: ${date}`);
        return "Invalid Date";
    }

    return dateObj.toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
};

// Alternative shorter alias
export const formatDateTime = formatDate;
