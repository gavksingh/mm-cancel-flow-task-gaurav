'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'

export function FeedbackStep() {
    const { state, dispatch } = useCancellation()
    const [feedback, setFeedback] = useState('')
    const [charCount, setCharCount] = useState(0)
    const MIN_CHARS = 25
    const MAX_CHARS = 500

    const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        if (text.length <= MAX_CHARS) {
            setFeedback(text)
            setCharCount(text.length)
        }
    }

    const handleContinue = () => {
        if (feedback.length >= MIN_CHARS) {
            dispatch({
                type: 'SET_REASON',
                payload: JSON.stringify({
                    ...JSON.parse(state.selectedReason || '{}'),
                    feedback: feedback
                })
            })

            dispatch({ type: 'SET_STEP', payload: 'downsell' })
        }
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'reason' })
    }

    const isValid = feedback.length >= MIN_CHARS

    return (
        <>
            {/* Mobile Layout */}
            <div className="md:hidden">
                {/* Mobile Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-base font-semibold text-gray-900">
                            Subscription Cancellation
                        </h1>
                        <button
                            onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
                            className="text-gray-400 hover:text-gray-600"
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
                                <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-500">Step 2 of 3</span>
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <div className="px-6 py-2">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <h2 className="text-[24px] leading-tight font-bold text-gray-900 mb-2">
                        What's one thing you wish we<br />
                        could've helped you with?
                    </h2>

                    {/* Horizontal line after heading */}
                    <div className="w-full border-t border-gray-200 mb-3"></div>

                    <p className="text-[14px] text-gray-600 mb-4">
                        We're always looking to improve, your thoughts can help us make Migrate Mate more useful for others.*
                    </p>

                    {/* Textarea with character count inside */}
                    <div className="relative mb-4">
                        <textarea
                            value={feedback}
                            onChange={handleFeedbackChange}
                            placeholder="Your feedback..."
                            className="w-full h-40 p-3 pb-8 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-400 text-gray-900"
                            minLength={MIN_CHARS}
                            maxLength={MAX_CHARS}
                        />
                        <p className="absolute bottom-2 right-3 text-xs text-gray-500">
                            Min {MIN_CHARS} characters ({charCount}/{MIN_CHARS})
                        </p>
                    </div>

                    {/* Horizontal line before continue */}
                    <div className="w-full border-t border-gray-200 mb-4"></div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!isValid}
                        className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all ${isValid
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                {/* Desktop Header */}
                <div className="px-8 py-3 border-b border-gray-100 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900"
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
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Step 2 of 3</span>
                        </div>
                    </div>

                    <button
                        onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex p-6 md:p-6">
                    {/* Left Side - Content (increased width) */}
                    <div className="flex-1 pr-6 max-w-[600px]">
                        <h2 className="text-[36px] leading-tight font-bold text-gray-900 mb-2">
                            What's one thing you wish we<br />
                            could've helped you with?
                        </h2>

                        <p className="text-[16px] text-gray-600 mb-6">
                            We're always looking to improve, your thoughts can help us<br />
                            make Migrate Mate more useful for others.*
                        </p>

                        {/* Textarea with character count inside */}
                        <div className="relative mb-6">
                            <textarea
                                value={feedback}
                                onChange={handleFeedbackChange}
                                placeholder="Your feedback..."
                                className="w-full h-36 p-4 pb-10 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-400 text-gray-900"
                                minLength={MIN_CHARS}
                                maxLength={MAX_CHARS}
                            />
                            <p className="absolute bottom-3 right-4 text-sm text-gray-500">
                                Min {MIN_CHARS} characters ({charCount}/{MIN_CHARS})
                            </p>
                        </div>

                        {/* Horizontal line before continue */}
                        <div className="w-full border-t border-gray-200 mb-6"></div>

                        {/* Continue Button - full width of left side */}
                        <button
                            onClick={handleContinue}
                            disabled={!isValid}
                            className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all ${isValid
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Continue
                        </button>
                    </div>

                    {/* Right Side - Image */}
                    <div className="ml-8">
                        <div className="relative w-[420px] h-[420px] overflow-hidden rounded-2xl shadow-xl">
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