/**
 * Utility to handle custom news dates by embedding them in the content field.
 * This is a workaround for backends that override createdAt and don't support new fields.
 */

export const DATE_MARKER_PREFIX = "[PUBLISHED_DATE:";
export const DATE_MARKER_SUFFIX = "]";

/**
 * Embeds a custom date into the HTML content string.
 */
export const embedDateInContent = (content: string, date: string): string => {
    // Remove any existing marker first to avoid duplicates
    const cleanContent = content.replace(/\[PUBLISHED_DATE:.*?\]/g, "");
    return `${cleanContent}${DATE_MARKER_PREFIX}${date}${DATE_MARKER_SUFFIX}`;
};

/**
 * Extracts the custom date from the HTML content string if it exists.
 * Returns the original createdAt date as fallback.
 */
export const getEffectiveDate = (news: { content?: string; createdAt: string; publishedDate?: string }): string => {
    // 1. Try to get from the newly added publishedDate field (if the backend ever supports it)
    if (news.publishedDate) return news.publishedDate;

    // 2. Try to extract from the embedded marker in content
    if (news.content) {
        const regex = /\[PUBLISHED_DATE:(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}.\d{3}Z)?)\]/;
        const match = news.content.match(regex);
        if (match && match[1]) {
            return match[1];
        }
    }

    // 3. Fallback to createdAt
    return news.createdAt;
};

/**
 * Cleans the content for display by removing the hidden date marker.
 */
export const cleanContentForDisplay = (content: string): string => {
    return content.replace(/\[PUBLISHED_DATE:.*?\]/g, "");
};
