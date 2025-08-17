// 'use client'

// import { useState, useCallback } from 'react'
// import { ABVariant } from '@/types/cancellation'
// import { MOCK_USER_ID } from '@/utils/constants'

// export function useCancellationFlow() {
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     const submitCancellation = useCallback(async (
//         reason: string,
//         acceptedDownsell: boolean,
//         variant: ABVariant
//     ) => {
//         setIsSubmitting(true)
//         setError(null)

//         try {
//             // ============================================
//             // USING MOCK SUBMISSION FOR LOCAL TESTING
//             // TODO: Replace with real Supabase insert after running seed.sql
//             // ============================================
//             console.log('📤 Submitting cancellation (MOCK):', {
//                 reason: JSON.parse(reason),
//                 acceptedDownsell,
//                 variant,
//                 userId: MOCK_USER_ID,
//                 timestamp: new Date().toISOString()
//             })

//             // Simulate API delay
//             await new Promise(resolve => setTimeout(resolve, 1000))

//             // Mock successful submission
//             const mockResult = {
//                 success: true,
//                 cancellation: {
//                     id: 'mock-cancel-' + Date.now(),
//                     user_id: MOCK_USER_ID,
//                     subscription_id: 'mock-sub-123',
//                     downsell_variant: variant,
//                     reason: reason,
//                     accepted_downsell: acceptedDownsell,
//                     created_at: new Date().toISOString()
//                 }
//             }

//             console.log('✅ Cancellation submitted successfully:', mockResult)
//             return mockResult

//             // ============================================
//             // TODO: Uncomment after database setup with seed.sql
//             // ============================================
//             /*
//             const { data: cancellation, error } = await supabase
//                 .from('cancellations')
//                 .insert({
//                     user_id: MOCK_USER_ID,
//                     subscription_id: 'subscription-id-from-context',
//                     downsell_variant: variant,
//                     reason: reason,
//                     accepted_downsell: acceptedDownsell
//                 })
//                 .select()
//                 .single()

//             if (error) throw error

//             // Update subscription status if not accepting downsell
//             if (!acceptedDownsell) {
//                 await supabase
//                     .from('subscriptions')
//                     .update({ status: 'pending_cancellation' })
//                     .eq('user_id', MOCK_USER_ID)
//             }

//             return { success: true, cancellation }
//             */

//         } catch (err) {
//             const errorMessage = err instanceof Error ? err.message : 'An error occurred'
//             setError(errorMessage)
//             console.error('❌ Error in submitCancellation:', errorMessage)

//             // For testing, don't throw - just return error
//             return { success: false, error: errorMessage }
//         } finally {
//             setIsSubmitting(false)
//         }
//     }, [])

//     const resetError = useCallback(() => {
//         setError(null)
//     }, [])

//     return {
//         submitCancellation,
//         isSubmitting,
//         error,
//         resetError
//     }
// }



'use client'

import { useCallback } from 'react'
import { useCancellation } from '@/context/CancellationContext'

export function useCancellationFlow() {
    const { state, dispatch } = useCancellation()

    const submitCancellation = useCallback(async (
        reason: string,
        acceptedDownsell: boolean,
        variant: 'A' | 'B'
    ) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            console.log('📤 Submitting cancellation:', { reason, acceptedDownsell, variant })

            const response = await fetch('/api/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: reason // reason is already JSON stringified from components
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to submit cancellation')
            }

            const data = await response.json()

            // Store the variant returned from server
            if (data.variant) {
                dispatch({ type: 'SET_VARIANT', payload: data.variant })
            }

            console.log('✅ Cancellation submitted successfully:', data)

            // If accepted downsell, payment processing would happen here
            if (acceptedDownsell && variant === 'B') {
                console.log('💳 Payment processing would happen here for downsell')
                // In production: await processPayment(...)
            }

            return data
        } catch (error) {
            console.error('❌ Error in submitCancellation:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit cancellation'
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            throw error
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }, [dispatch])

    return {
        submitCancellation,
        isSubmitting: state.isLoading
    }
}