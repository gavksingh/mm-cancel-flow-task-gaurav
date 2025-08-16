'use client'

import { useState, useCallback } from 'react'
import { ABVariant } from '@/types/cancellation'
import { MOCK_USER_ID } from '@/utils/constants'

export function useCancellationFlow() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submitCancellation = useCallback(async (
        reason: string,
        acceptedDownsell: boolean,
        variant: ABVariant
    ) => {
        setIsSubmitting(true)
        setError(null)

        try {
            // ============================================
            // USING MOCK SUBMISSION FOR LOCAL TESTING
            // TODO: Replace with real Supabase insert after running seed.sql
            // ============================================
            console.log('📤 Submitting cancellation (MOCK):', {
                reason: JSON.parse(reason),
                acceptedDownsell,
                variant,
                userId: MOCK_USER_ID,
                timestamp: new Date().toISOString()
            })

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock successful submission
            const mockResult = {
                success: true,
                cancellation: {
                    id: 'mock-cancel-' + Date.now(),
                    user_id: MOCK_USER_ID,
                    subscription_id: 'mock-sub-123',
                    downsell_variant: variant,
                    reason: reason,
                    accepted_downsell: acceptedDownsell,
                    created_at: new Date().toISOString()
                }
            }

            console.log('✅ Cancellation submitted successfully:', mockResult)
            return mockResult

            // ============================================
            // TODO: Uncomment after database setup with seed.sql
            // ============================================
            /*
            const { data: cancellation, error } = await supabase
                .from('cancellations')
                .insert({
                    user_id: MOCK_USER_ID,
                    subscription_id: 'subscription-id-from-context',
                    downsell_variant: variant,
                    reason: reason,
                    accepted_downsell: acceptedDownsell
                })
                .select()
                .single()

            if (error) throw error

            // Update subscription status if not accepting downsell
            if (!acceptedDownsell) {
                await supabase
                    .from('subscriptions')
                    .update({ status: 'pending_cancellation' })
                    .eq('user_id', MOCK_USER_ID)
            }

            return { success: true, cancellation }
            */

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred'
            setError(errorMessage)
            console.error('❌ Error in submitCancellation:', errorMessage)

            // For testing, don't throw - just return error
            return { success: false, error: errorMessage }
        } finally {
            setIsSubmitting(false)
        }
    }, [])

    const resetError = useCallback(() => {
        setError(null)
    }, [])

    return {
        submitCancellation,
        isSubmitting,
        error,
        resetError
    }
}