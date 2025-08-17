
'use client'

import { useCallback } from 'react'
import { useCancellation } from '@/context/CancellationContext'

export function useSubscription() {
    const { dispatch } = useCancellation()

    const fetchSubscriptionInfo = useCallback(async () => {
        try {
            console.log('📦 Fetching subscription info...')

            const response = await fetch('/api/cancel', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch subscription')
            }

            const data = await response.json()
            console.log('✅ Subscription data:', data)

            // Validate subscription data
            if (!data.subscription_id) {
                throw new Error('Unable to load subscription information. Please try again.')
            }

            // Set price in context (already in cents from API)
            if (data.price) {
                dispatch({ type: 'SET_PRICE', payload: data.price })
            }

            // Generate variant deterministically (will be overridden by server)
            // For now, just set a default
            dispatch({ type: 'SET_VARIANT', payload: 'A' })

            return data
        } catch (error) {
            console.error('❌ Failed to fetch subscription info:', error)

            // Set default values on error
            dispatch({ type: 'SET_PRICE', payload: 2500 }) // Default $25
            dispatch({ type: 'SET_VARIANT', payload: 'A' })

            // Don't throw error to allow UI to continue
            return { price: 2500 }
        }
    }, [dispatch])

    return { fetchSubscriptionInfo }
}