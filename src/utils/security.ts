import crypto from 'crypto'

/**
 * Generates a CSRF token
 */
export function generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

/**
 * Hashes a value using SHA-256
 */
export function hashValue(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex')
}

/**
 * Validates request origin
 */
export function validateOrigin(origin: string | null): boolean {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        process.env.NEXT_PUBLIC_APP_URL
    ].filter(Boolean)

    return origin ? allowedOrigins.includes(origin) : false
}

/**
 * Sanitizes HTML content
 */
export function sanitizeHTML(html: string): string {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
}