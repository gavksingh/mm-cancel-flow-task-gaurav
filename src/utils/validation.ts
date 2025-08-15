import { CancellationData } from '@/types/cancellation'

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
        .slice(0, 500) // Limit length
}

/**
 * Validates cancellation input data
 */
export function validateCancellationInput(data: Partial<CancellationData>): CancellationData {
    // Validate required fields
    if (!data.userId) {
        throw new Error('User ID is required')
    }

    if (!data.reason || typeof data.reason !== 'string') {
        throw new Error('Valid cancellation reason is required')
    }

    if (!data.downsellVariant || !['A', 'B'].includes(data.downsellVariant)) {
        throw new Error('Valid downsell variant is required')
    }

    if (typeof data.acceptedDownsell !== 'boolean') {
        throw new Error('Downsell acceptance status is required')
    }

    // Sanitize and validate reason
    const sanitizedReason = sanitizeInput(data.reason)
    if (sanitizedReason.length < 1) {
        throw new Error('Cancellation reason cannot be empty')
    }

    // Return validated and sanitized data
    return {
        userId: data.userId,
        subscriptionId: data.subscriptionId || '',
        downsellVariant: data.downsellVariant,
        reason: sanitizedReason,
        acceptedDownsell: data.acceptedDownsell,
        createdAt: data.createdAt || new Date().toISOString()
    }
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validates subscription price
 */
export function validatePrice(price: number): boolean {
    return price > 0 && Number.isFinite(price)
}

/**
 * CSRF Token validation
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
    // In a real application, you would compare against a stored session token
    // This is a simplified example
    return token === sessionToken && token.length > 0
}

/**
 * Rate limiting check (simplified)
 */
export function checkRateLimit(userId: string, action: string): boolean {
    // In production, this would check against a Redis store or similar
    // This is a placeholder implementation
    const key = `${userId}:${action}`
    // Implement actual rate limiting logic here
    return true
}