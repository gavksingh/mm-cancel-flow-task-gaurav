'use client'

import { useCancellation } from '@/context/CancellationContext'
import { useCancellationFlow } from '@/hooks/useCancellationFlow'
import { ModalHeader } from '../shared/ModalHeader'
import { Button } from '../shared/Button'
import { formatPrice, getDiscountedPrice } from '@/lib/ab-test'

export function DownsellStep() {
    const { state, dispatch } = useCancellation()
    const { submitCancellation, isSubmitting } = useCancellationFlow()

    const discountedPrice = getDiscountedPrice(state.originalPrice, state.variant)

    const handleAcceptOffer = async () => {
        try {
            await submitCancellation(
                state.selectedReason || 'Still job searching',
                true,
                state.variant
            )
            dispatch({ type: 'SET_STEP', payload: 'success' })
        } catch (error) {
            console.error('Failed to accept offer:', error)
        }
    }

    const handleDeclineOffer = async () => {
        try {
            await submitCancellation(
                state.selectedReason || 'Still job searching',
                false,
                state.variant
            )
            dispatch({ type: 'SET_STEP', payload: 'confirm' })
        } catch (error) {
            console.error('Failed to decline offer:', error)
        }
    }

    return (
        <>
            <ModalHeader title="Special Offer" />
            <div className="px-8 py-8 md:px-10">
                {/* Implementation continues... */}
                <div className="flex gap-3">
                    <Button
                        onClick={handleDeclineOffer}
                        variant="outline"
                        fullWidth
                        isLoading={isSubmitting}
                    >
                        No thanks, continue cancelling
                    </Button>
                    <Button
                        onClick={handleAcceptOffer}
                        variant="success"
                        fullWidth
                        isLoading={isSubmitting}
                    >
                        {state.variant === 'B' ? 'Yes! Give me $10 off' : 'Yes! Keep my subscription'}
                    </Button>
                </div>
            </div>
        </>
    )
}