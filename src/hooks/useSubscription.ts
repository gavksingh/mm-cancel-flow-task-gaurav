'use client'

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
            // ============================================
            // USING MOCK DATA FOR LOCAL TESTING
            // TODO: Replace with real Supabase query after running seed.sql
            // ============================================
            console.log('📦 Fetching subscription (MOCK DATA)')

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300))

            const mockData = {
                subscription: {
                    id: 'mock-sub-123',
                    user_id: MOCK_USER_ID,
                    monthly_price: 2500, // $25 in cents
                    status: 'active'
                },
                variant: getDeterministicVariant(MOCK_USER_ID)
            }

            dispatch({ type: 'SET_PRICE', payload: mockData.subscription.monthly_price })
            dispatch({ type: 'SET_VARIANT', payload: mockData.variant })

            console.log('✅ Subscription loaded:', mockData)
            return mockData

            // ============================================
            // TODO: Uncomment after database setup with seed.sql
            // ============================================
            /*
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', MOCK_USER_ID)
                .eq('status', 'active')
                .single()

            if (error) throw error

            dispatch({ type: 'SET_PRICE', payload: data.monthly_price })
            dispatch({ type: 'SET_VARIANT', payload: getDeterministicVariant(MOCK_USER_ID) })
            
            return { subscription: data, variant: getDeterministicVariant(MOCK_USER_ID) }
            */

        } catch (err) {
            const errorMessage = 'Unable to load subscription. Please try again.'
            setError(errorMessage)
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            console.error('❌ Error fetching subscription:', err)

            // Set default values on error
            dispatch({ type: 'SET_PRICE', payload: 2500 })
            dispatch({ type: 'SET_VARIANT', payload: getDeterministicVariant(MOCK_USER_ID) })

            // Simple retry after 3 seconds
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