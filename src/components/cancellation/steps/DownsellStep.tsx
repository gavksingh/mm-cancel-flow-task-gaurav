'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { useCancellationFlow } from '@/hooks/useCancellationFlow'
import { useSubscription } from '@/hooks/useSubscription'

export function DownsellStep() {
    const { state, dispatch } = useCancellation()
    const { submitCancellation, isSubmitting } = useCancellationFlow()
    const { fetchSubscriptionInfo } = useSubscription()
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        fetchSubscriptionInfo()
    }, [])

    // Calculate 50% off with proper decimal formatting
    const discountedPrice = state.originalPrice / 2
    const originalPrice = state.originalPrice / 100 // Convert cents to dollars
    const discountedPriceFormatted = (discountedPrice / 100).toFixed(2)
    const originalPriceFormatted = originalPrice.toFixed(0) // Show as whole number

    const handleAcceptOffer = async () => {
        console.log('🎯 [DOWNSELL] User clicked "Get 50% off" - setting acceptedDownsell: TRUE')
        setIsProcessing(true)
        try {
            // Parse existing data to preserve it
            let existingData = {}
            try {
                if (state.selectedReason) {
                    existingData = JSON.parse(state.selectedReason)
                }
            } catch (e) {
                existingData = { reason: state.selectedReason || 'Still job searching' }
            }

            const payloadData = {
                ...existingData,
                jobStatus: state.jobStatus || 'Still job searching',
                acceptedAfterDownsell: true
            }

            console.log('📤 [DOWNSELL] Submitting with payload:', JSON.stringify(payloadData, null, 2))

            const result = await submitCancellation(
                JSON.stringify(payloadData),
                true, // acceptedDownsell = TRUE
                state.variant
            )

            // Only navigate if not already pending
            if (!result.__skipNavigation) {
                dispatch({ type: 'SET_STEP', payload: 'success-downsell' })
            }
        } catch (error) {
            console.error('Error accepting offer:', error)
            alert('There was an error processing your request. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDeclineOffer = async () => {
        // Don't submit cancellation yet, just go to survey
        dispatch({ type: 'SET_STEP', payload: 'survey' })
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'job-check' })
    }

    return (
        <>
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
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
                                <div className="w-6 h-1.5 bg-gray-400 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-500">Step 1 of 3</span>
                        </div>
                    </div>
                </div>

                {/* Back button - NO horizontal line after */}
                <div className="px-4 py-2">
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
                <div className="p-3">
                    <h2 className="text-[26px] leading-tight font-bold text-gray-800 mb-1">
                        We built this to help you land the job, this makes it a little easier.
                    </h2>

                    {/* Offer Box */}
                    <div className="bg-purple-100 rounded-xl p-3 mb-2">
                        <h3 className="text-[27px] font-bold text-gray-550 mb-2">
                            Here&apos;s <span className="underline">50% off</span> until you find a job.
                        </h3>

                        <div className="flex items-baseline space-x-1 mb-4">
                            <span className="text-[27px] font-bold text-purple-600">
                                ${discountedPriceFormatted}
                            </span>
                            <span className="text-[25px] text-gray-600">/month</span>
                            <span className="text-[20px] text-gray-500 line-through ml-2">
                                ${originalPriceFormatted}/month
                            </span>
                        </div>

                        <button
                            onClick={handleAcceptOffer}
                            disabled={isProcessing || isSubmitting}
                            className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isProcessing || isSubmitting ? 'Processing...' : 'Get 50% off'}
                        </button>

                        <p className="text-xs text-gray-600 text-center mt-2 italic">
                            You won&apos;t be charged until your next billing date.
                        </p>
                    </div>

                    {/* Horizontal line with shadow before No thanks */}
                    <div className="relative py-2">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                            <div className="w-full border-t border-gray-200"></div>
                            <div className="w-full h-0.5 bg-gradient-to-b from-gray-200/50 to-transparent"></div>
                        </div>
                    </div>

                    {/* No thanks button */}
                    <button
                        onClick={handleDeclineOffer}
                        disabled={isProcessing || isSubmitting}
                        className="w-full py-3.5 px-6 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        No thanks
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
                                <div className="w-8 h-2 bg-gray-400 rounded-full"></div>
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Step 1 of 3</span>
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
                    <div className="flex-1 pr-9 max-w-[680px] md:max-w-[600px] lg:max-w-[680px]">
                        <h2 className="text-[32px] md:text-[30px] lg:text-[32px] leading-tight font-bold text-gray-900 mb-1">
                            We built this to help you land the job, this makes it a little easier.
                        </h2>

                        <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-600 mb-6">
                            We&apos;ve been there and we&apos;re here to help you.
                        </p>

                        {/* Offer Box - Only this section has purple background */}
                        <div className="bg-purple-100 rounded-xl p-6">
                            <h3 className="text-[24px] md:text-[22px] lg:text-[24px] font-bold text-gray-550 mb-2">
                                Here&apos;s <span className="underline">50% off</span> until you find a job.
                            </h3>

                            <div className="flex items-baseline mb-4">
                                <span className="text-2xl font-bold text-purple-600">
                                    ${discountedPriceFormatted}
                                </span>
                                <span className="text-[24px] text-gray-600 ml-1">/month</span>
                                <span className="text-gray-500 line-through ml-4">
                                    ${originalPriceFormatted}/month
                                </span>
                            </div>

                            <button
                                onClick={handleAcceptOffer}
                                disabled={isProcessing || isSubmitting}
                                className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isProcessing || isSubmitting ? 'Processing...' : 'Get 50% off'}
                            </button>

                            <p className="text-xs text-gray-600 text-center mt-2 italic">
                                You won&apos;t be charged until your next billing date.
                            </p>
                        </div>

                        {/* Horizontal line with shadow */}
                        {/* <div className="relative my-4">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                                <div className="w-full border-t border-gray-200"></div>
                                <div className="w-full h-0.5 bg-gradient-to-b from-gray-200/50 to-transparent"></div>
                            </div>
                        </div> */}
                        <div className="h-px bg-gray-300 my-4"></div>

                        {/* No thanks button */}
                        <button
                            onClick={handleDeclineOffer}
                            disabled={isProcessing || isSubmitting}
                            className="w-full py-3.5 px-6 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            No thanks
                        </button>
                    </div>

                    {/* Right Side - Image */}
                    <div className="ml-8">
                        <div className="relative w-[480px] h-[420px] md:w-[400px] md:h-[350px] lg:w-[480px] lg:h-[420px] overflow-hidden rounded-2xl shadow-xl">
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