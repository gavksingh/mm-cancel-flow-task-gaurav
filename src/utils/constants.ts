export const CANCELLATION_REASONS = [
    'Too expensive',
    'Not using it enough',
    'Found a better alternative',
    'Technical issues',
    'Other'
] as const

export const SUBSCRIPTION_PLANS = {
    BASIC: {
        monthlyPrice: 2500, // $25 in cents
        name: 'Basic Plan'
    },
    PREMIUM: {
        monthlyPrice: 2900, // $29 in cents
        name: 'Premium Plan'
    }
} as const

export const DOWNSELL_DISCOUNT = 1000 // $10 in cents

export const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440001'

export const API_ROUTES = {
    CANCELLATION: '/api/cancellation',
    SUBSCRIPTION: '/api/subscription'
} as const