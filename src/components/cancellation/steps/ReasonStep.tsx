'use client'

import { useCancellation } from '@/context/CancellationContext'
import { ModalHeader } from '../shared/ModalHeader'
import { Button } from '../shared/Button'

const CANCELLATION_REASONS = [
    'Too expensive',
    'Not using it enough',
    'Found a better alternative',
    'Technical issues',
    'Other'
]

export function ReasonStep() {
    const { state, dispatch } = useCancellation()

    const handleReasonSelect = (reason: string) => {
        dispatch({ type: 'SET_REASON', payload: reason })
    }

    const handleContinue = () => {
        if (state.selectedReason) {
            dispatch({ type: 'SET_STEP', payload: 'downsell' })
        }
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'job-check' })
    }

    return (
        <>
            <ModalHeader title="Tell us why" />
            <div className="px-8 py-8 md:px-10">
                <h2 className="text-[28px] font-bold mb-3">
                    Congratulations on the new role! 🎉
                </h2>
                <p className="text-[15px] text-gray-600 mb-8">
                    Before you go, mind telling us why you're cancelling?
                </p>

                <div className="space-y-3 mb-8">
                    {CANCELLATION_REASONS.map((reason) => (
                        <label
                            key={reason}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-400 ${state.selectedReason === reason ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="reason"
                                value={reason}
                                checked={state.selectedReason === reason}
                                onChange={() => handleReasonSelect(reason)}
                                className="w-5 h-5 text-blue-600 mr-3"
                            />
                            <span className={`text-[15px] ${state.selectedReason === reason ? 'font-medium text-gray-900' : 'text-gray-700'
                                }`}>
                                {reason}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button onClick={handleBack} variant="outline" fullWidth>
                        Back
                    </Button>
                    <Button
                        onClick={handleContinue}
                        variant="danger"
                        fullWidth
                        disabled={!state.selectedReason}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </>
    )
}