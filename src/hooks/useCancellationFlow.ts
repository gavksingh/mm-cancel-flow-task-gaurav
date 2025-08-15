import { useState, useCallback } from 'react'
import { ABVariant } from '@/types/cancellation'
import { MOCK_USER_ID } from '@/utils/constants'

interface CancellationSubmitData {
    reason: string
    acceptedDownsell: boolean
    variant: ABVariant
}

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
            const response = await fetch('/api/cancellation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reason,
                    acceptedDownsell,
                    variant,
                    userId: MOCK_USER_ID // In production, get from auth context
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to process cancellation')
            }

            const result = await response.json()
            return result
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred'
            setError(errorMessage)
            throw err
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