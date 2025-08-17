'use client'

import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'

export function PendingCancellationStep() {
    const { dispatch } = useCancellation()

    const handleGoBack = () => {
        // In a real app, this would navigate to the user's account/profile page
        window.location.href = '/'
    }

    return (
        <>
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-base font-semibold text-gray-900">
                            Subscription Status
                        </h1>
                        <button
                            onClick={handleGoBack}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        {/* Status Icon and Title in one line */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-[20px] font-bold text-gray-900">
                                Cancellation Request Received
                            </h2>
                        </div>

                        <p className="text-[16px] text-gray-600 mb-6 leading-relaxed">
                            Thank you for your feedback. We&apos;ve already received your
                            subscription cancellation request and it&apos;s being processed.
                            You&apos;ll receive a confirmation email once complete.
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-blue-900 mb-1">What happens next?</h3>
                                <p className="text-sm text-blue-700">
                                    Your subscription remains active until the end of your current billing period.
                                    You&apos;ll continue to have full access to all features during this time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleGoBack}
                        className="w-full py-3.5 px-6 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        Back to Account
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                {/* Desktop Header */}
                <div className="px-8 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-lg font-semibold text-gray-900">Subscription Status</h1>
                    </div>

                    <button
                        onClick={handleGoBack}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex p-8">
                    {/* Left Side - Content */}
                    <div className="flex-1 pr-10 max-w-[600px]">
                        <div className="mb-8">
                            {/* Status Icon and Title in one line */}
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-[32px] font-bold text-gray-900">
                                    Cancellation Request Received
                                </h2>
                            </div>

                            <p className="text-[18px] text-gray-600 mb-8 leading-relaxed">
                                Thank you for your feedback. We&apos;ve already received your
                                subscription cancellation request and it&apos;s being processed.
                                You&apos;ll receive a confirmation email once complete.
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-blue-500 mt-1 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-base font-medium text-blue-900 mb-2">What happens next?</h3>
                                    <p className="text-base text-blue-700">
                                        Your subscription remains active until the end of your current billing period.
                                        You&apos;ll continue to have full access to all features during this time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleGoBack}
                            className="w-full py-3.5 px-6 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            Back to Account
                        </button>
                    </div>

                    {/* Right Side - Image */}
                    <div className="ml-8 flex-shrink-0">
                        <div className="relative w-[480px] h-full min-h-[400px] overflow-hidden rounded-2xl shadow-xl">
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
