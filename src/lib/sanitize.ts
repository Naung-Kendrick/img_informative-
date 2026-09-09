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
            "table", "thead", "tbody", "tr", "td", "th"
        ],
        ALLOWED_ATTR: [
            "href", "src", "alt", "title", "target", "rel",
            "class", "style", "width", "height"
        ],
        FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "base", "form", "input", "button"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):)/i,
    });
}

/**
 * Strip all HTML tags, decode HTML entities (like &nbsp;), and return plain text (for previews).
 */
export function stripHtml(html: string, maxLength = 160): string {
    if (!html) return "";
    
    // Replace block-level tag closures and breaks with spaces to prevent words from sticking together
    let plain = html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/p>/gi, " ")
        .replace(/<\/div>/gi, " ")
        .replace(/<[^>]*>?/gm, "");
    
    // Decode HTML entities
    if (typeof window !== "undefined") {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(plain, "text/html");
            plain = doc.documentElement.textContent || plain;
        } catch (e) {
            // Fallback for simple entity replacement
            plain = plain
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
        }
    } else {
        // Fallback if running outside of browser context (e.g. tests)
        plain = plain
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    }
    
    // Replace non-breaking spaces (\u00A0) with standard spaces
    plain = plain.replace(/\u00A0/g, " ").trim();

    return plain.length > maxLength ? plain.substring(0, maxLength) + "..." : plain;
}
