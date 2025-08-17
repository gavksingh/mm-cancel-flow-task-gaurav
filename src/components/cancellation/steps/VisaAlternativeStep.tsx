'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { useCancellationFlow } from '@/hooks/useCancellationFlow'
import { useSubscription } from '@/hooks/useSubscription'

export function VisaAlternativeStep() {
    const { state, dispatch } = useCancellation()
    const { fetchSubscriptionInfo } = useSubscription()
    const { submitCancellation, isSubmitting } = useCancellationFlow()
    const [visaAssistance, setVisaAssistance] = useState<'yes' | 'no' | null>(null)
    const [visaType, setVisaType] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    useEffect(() => {
        fetchSubscriptionInfo()
    }, [fetchSubscriptionInfo])

    const handleCompleteCancellation = async () => {
        // Clear previous error
        setLocalError(null)

        if (!visaAssistance) {
            setLocalError('Please select an option to continue')
            return
        }

        // Validate visa type input based on selection
        if (!visaType.trim()) {
            setLocalError(visaAssistance === 'yes'
                ? 'Please enter what visa you will be applying for'
                : 'Please enter which visa you would like to apply for'
            )
            return
        }

        setIsProcessing(true)
        try {
            // Parse existing reason data and add visa assistance info
            const reasonData = JSON.parse(state.selectedReason || '{}')
            const updatedReason = {
                ...reasonData,
                visaAssistance: visaAssistance === 'yes',
                visaType: visaType
            }

            // Submit cancellation with all collected data
            const result = await submitCancellation(
                JSON.stringify(updatedReason),
                false, // not accepting downsell since they found a job
                state.variant
            )

            // Only navigate if not already pending
            if (!result.__skipNavigation) {
                if (visaAssistance === 'yes') {
                    dispatch({ type: 'SET_STEP', payload: 'success' })
                } else {
                    dispatch({ type: 'SET_STEP', payload: 'success-visa-help' })
                }
            }
        } catch (error) {
            console.error('Error completing cancellation:', error)
            alert('There was an error processing your cancellation. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'feedback' })
    }

    // Custom Radio Button Component
    const RadioButton = ({ value, label }: { value: 'yes' | 'no', label: string }) => (
        <label
            className="flex items-center cursor-pointer"
            onClick={() => {
                setLocalError(null) // Clear error when selecting
                setVisaAssistance(value)
            }}
        >
            <div className="relative">
                <div className={`w-5 h-5 rounded-full border-2 transition-colors ${visaAssistance === value
                    ? 'border-gray-900 bg-gray-900'
                    : 'border-gray-300'
                    }`}>
                    {visaAssistance === value && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                    )}
                </div>
            </div>
            <span className="ml-3 text-gray-700 select-none">{label}</span>
        </label>
    )

    return (
        <>
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-base font-semibold text-gray-900">
                            Subscription Cancellation
                        </h1>
                        <button
                            onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-500">Step 3 of 3</span>
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <div className="px-6 py-2">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <h2 className="text-[24px] leading-tight font-bold text-gray-600 mb-0">
                        You landed the job!
                    </h2>
                    <h3 className="text-[24px] leading-tight font-bold text-gray-600 italic mb-4">
                        That's what we live for.
                    </h3>

                    <p className="text-[14px] font-bold text-gray-600 mb-4">
                        Even if it wasn't through Migrate Mate,<br />
                        let us help get your <span className="underline">visa</span> sorted.
                    </p>

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-200 mb-6"></div>

                    <p className="text-[15px] text-gray-700 mb-6">
                        Is your company providing an immigration lawyer to help with your visa?*
                    </p>

                    {/* Radio buttons - show both if none selected, only selected one if chosen */}
                    <div className="space-y-3 mb-6">
                        {(!visaAssistance || visaAssistance === 'yes') && (
                            <RadioButton value="yes" label="Yes" />
                        )}
                        {(!visaAssistance || visaAssistance === 'no') && (
                            <RadioButton value="no" label="No" />
                        )}
                    </div>

                    {/* Conditional visa type input */}
                    {visaAssistance === 'yes' && (
                        <div className="mb-8">
                            <label className="block text-[15px] text-gray-700 mb-3">
                                What visa will you be applying for?*
                            </label>
                            <input
                                type="text"
                                value={visaType}
                                onChange={(e) => {
                                    setVisaType(e.target.value)
                                    setLocalError(null)
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                placeholder=""
                            />
                        </div>
                    )}

                    {visaAssistance === 'no' && (
                        <div className="mb-8">
                            <p className="text-[14px] text-gray-600 mb-3">
                                We can connect you with one of our trusted partners.<br />
                                Which visa would you like to apply for?*
                            </p>
                            <input
                                type="text"
                                value={visaType}
                                onChange={(e) => {
                                    setVisaType(e.target.value)
                                    setLocalError(null)
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                placeholder=""
                            />
                        </div>
                    )}

                    {/* Error message */}
                    {localError && (
                        <p className="text-red-600 text-sm mb-4 font-medium">
                            ⚠️ {localError}
                        </p>
                    )}

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-200 mb-6"></div>

                    {/* Complete cancellation Button */}
                    <button
                        onClick={handleCompleteCancellation}
                        disabled={isProcessing || isSubmitting}
                        className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all cursor-pointer ${!isProcessing && !isSubmitting
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing || isSubmitting ? 'Processing...' : 'Complete cancellation'}
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                {/* Desktop Header */}
                <div className="px-8 py-3 border-b border-gray-100 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <div className="flex items-center space-x-6">
                        <h1 className="text-lg font-semibold text-gray-900">Subscription Cancellation</h1>

                        <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                                <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                                <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Step 3 of 3</span>
                        </div>
                    </div>

                    <button
                        onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex p-8 md:p-6 lg:p-8">
                    {/* Left Side - Content */}
                    <div className="flex-1 pr-6 max-w-[600px] md:max-w-[500px] lg:max-w-[600px]">
                        <h2 className="text-[34px] md:text-[32px] lg:text-[34px] leading-tight font-bold text-gray-600 mb-0">
                            You landed the job!
                        </h2>
                        <h3 className="text-[34px] md:text-[32px] lg:text-[34px] leading-tight font-bold text-gray-600 italic mb-6">
                            That's what we live for.
                        </h3>

                        <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-600 mb-7">
                            Even if it wasn't through MigrateMate,<br />
                            let us help get your <span className="underline">visa</span> sorted.
                        </p>

                        <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-8">
                            Is your company providing an immigration lawyer to help with your visa?*
                        </p>

                        {/* Radio buttons - show both if none selected, only selected one if chosen */}
                        <div className="space-y-4 mb-6">
                            {(!visaAssistance || visaAssistance === 'yes') && (
                                <RadioButton value="yes" label="Yes" />
                            )}
                            {(!visaAssistance || visaAssistance === 'no') && (
                                <RadioButton value="no" label="No" />
                            )}
                        </div>

                        {/* Conditional visa type input */}
                        {visaAssistance === 'yes' && (
                            <div className="mb-8">
                                <label className="block text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-3">
                                    What visa will you be applying for?*
                                </label>
                                <input
                                    type="text"
                                    value={visaType}
                                    onChange={(e) => {
                                        setVisaType(e.target.value)
                                        setLocalError(null)
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-[16px]"
                                    placeholder=""
                                />
                            </div>
                        )}

                        {visaAssistance === 'no' && (
                            <div className="mb-8">
                                <p className="text-[15px] text-gray-600 mb-3">
                                    We can connect you with one of our trusted partners.<br />
                                    Which visa would you like to apply for?*
                                </p>
                                <input
                                    type="text"
                                    value={visaType}
                                    onChange={(e) => {
                                        setVisaType(e.target.value)
                                        setLocalError(null)
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-[16px]"
                                    placeholder=""
                                />
                            </div>
                        )}

                        {/* Error message */}
                        {localError && (
                            <p className="text-red-600 text-sm mb-4 font-medium">
                                ⚠️ {localError}
                            </p>
                        )}

                        {/* Horizontal line */}
                        <div className="w-full border-t border-gray-200 mb-6"></div>

                        {/* Complete cancellation Button */}
                        <button
                            onClick={handleCompleteCancellation}
                            disabled={isProcessing || isSubmitting}
                            className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all cursor-pointer ${!isProcessing && !isSubmitting
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isProcessing || isSubmitting ? 'Processing...' : 'Complete cancellation'}
                        </button>
                    </div>

                    {/* Right Side - Image */}
                    <div className="ml-8">
                        <div className="relative w-[420px] h-[420px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                src="/empire-state-compressed.jpg"
                                alt="New York City skyline"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}