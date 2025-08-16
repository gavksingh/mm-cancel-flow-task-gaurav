import { useState, useCallback } from 'react'
import { useCancellation } from '@/context/CancellationContext'
import { getDeterministicVariant } from '@/lib/ab-test'
import { MOCK_USER_ID } from '@/utils/constants'

export function useSubscription() {
    const { dispatch } = useCancellation()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchSubscriptionInfo = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        // Clear any previous errors
        dispatch({ type: 'CLEAR_ALL_ERRORS' })

        try {
            const response = await fetch('/api/cancellation')

            if (!response.ok) {
                throw new Error('Failed to fetch subscription')
            }

            const data = await response.json()

            if (data.subscription) {
                dispatch({ type: 'SET_PRICE', payload: data.subscription.monthly_price })
                dispatch({ type: 'SET_VARIANT', payload: data.variant })
            }

            return data
        } catch (err) {
            const errorMessage = 'Unable to load subscription. Please try again.'
            setError(errorMessage)
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            console.error('Error fetching subscription:', err)

            // Set default values on error
            dispatch({ type: 'SET_PRICE', payload: 2500 })
            dispatch({ type: 'SET_VARIANT', payload: getDeterministicVariant(MOCK_USER_ID) })

            // Simple retry - call fetchSubscriptionInfo again after a delay
            setTimeout(() => {
                fetchSubscriptionInfo()
            }, 3000)
        } finally {
            setIsLoading(false)
        }
    }, [dispatch])

    return {
        fetchSubscriptionInfo,
        isLoading,
        error
    }
}