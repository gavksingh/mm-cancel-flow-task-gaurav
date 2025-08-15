'use client'

import { useCancellation } from '@/context/CancellationContext'
import { ModalHeader } from '../shared/ModalHeader'
import { Button } from '../shared/Button'

export function ConfirmStep() {
    const { dispatch } = useCancellation()

    const handleFinalCancel = () => {
        dispatch({ type: 'SET_STEP', payload: 'success' })
    }

    const handleGoBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'downsell' })
    }

    return (
        <>
            <ModalHeader title="Confirm Cancellation" />
            <div className="px-8 py-8 md:px-10">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-[28px] font-bold mb-3">
                        Are you absolutely sure?
                    </h2>
                    <p className="text-[15px] text-gray-600 max-w-md mx-auto">
                        You'll lose access to all premium features immediately and this action cannot be undone.
                    </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                    <p className="text-[14px] text-red-800">
                        <strong className="font-semibold">Warning:</strong> You'll need to resubscribe at the full price if you change your mind later.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button onClick={handleGoBack} variant="outline" fullWidth>
                        Wait, go back
                    </Button>
                    <Button onClick={handleFinalCancel} variant="danger" fullWidth>
                        Yes, cancel my subscription
                    </Button>
                </div>
            </div>
        </>
    )
}