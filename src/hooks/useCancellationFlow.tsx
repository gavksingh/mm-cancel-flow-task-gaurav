

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
            console.log('📤 [HOOK] Submitting cancellation:', { reason, acceptedDownsell, variant })

            // CRITICAL FIX: Parse reason and add acceptedDownsell to the payload
            let parsedReason: any
            try {
                parsedReason = JSON.parse(reason)
            } catch (e) {
                parsedReason = { reason }
            }

            // Add the acceptedDownsell field to the payload
            const payload = {
                ...parsedReason,
                acceptedDownsell: acceptedDownsell
            }

            console.log('💾 [HOOK] Sending payload with acceptedDownsell:', JSON.stringify(payload, null, 2))

            const response = await fetch('/api/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload) // Now includes acceptedDownsell
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