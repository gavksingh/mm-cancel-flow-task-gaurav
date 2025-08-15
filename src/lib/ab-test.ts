import crypto from 'crypto'

export function getDeterministicVariant(userId: string): 'A' | 'B' {
    const hash = crypto.createHash('sha256').update(userId).digest('hex')
    const hashInt = parseInt(hash.substring(0, 8), 16)
    return hashInt % 2 === 0 ? 'A' : 'B'
}

export function getDiscountedPrice(originalPrice: number, variant: 'A' | 'B'): number {
    if (variant === 'B') {
        return originalPrice - 1000 // $10 off in cents
    }
    return originalPrice
}

export function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(0)}`
}