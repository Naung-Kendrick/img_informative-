import DOMPurify from "dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe formatting tags but strips scripts and dangerous attributes.
 */
export function sanitizeHtml(dirty: string): string {
    if (!dirty) return "";
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            "p", "br", "span", "div", "strong", "em", "u", "s",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li", "blockquote",
            "a", "img", "code", "pre",
            "table", "thead", "tbody", "tr", "td", "th",
            "iframe"
        ],
        ALLOWED_ATTR: [
            "href", "src", "alt", "title", "target", "rel",
            "class", "style", "width", "height",
            "allow", "allowfullscreen", "frameborder"
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
}

/**
 * Strip all HTML tags and return plain text (for previews).
 */
export function stripHtml(html: string, maxLength = 160): string {
    if (!html) return "";
    const plain = html.replace(/<[^>]*>?/gm, "");
    return plain.length > maxLength ? plain.substring(0, maxLength) + "..." : plain;
}
