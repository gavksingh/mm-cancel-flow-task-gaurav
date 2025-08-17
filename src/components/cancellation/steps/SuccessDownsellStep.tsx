'use client'

import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'

export function SuccessDownsellStep() {
    const { state } = useCancellation()

    const handleFinish = () => {
        // Close the modal or redirect to dashboard
        window.location.href = '/' // or wherever you want to redirect
    }

    // Calculate the discounted price
    const discountedPrice = (state.originalPrice / 200).toFixed(2) // 50% off, convert cents to dollars

    return (
        <>
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <div className="px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-base font-semibold text-gray-900">
                            Subscription Continued
                        </h1>
                        <button
                            onClick={handleFinish}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {/* Image first on mobile */}
                    <div className="relative w-full h-[200px] mb-6 overflow-hidden rounded-2xl">
                        <Image
                            src="/empire-state-compressed.jpg"
                            alt="New York City skyline"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <h2 className="text-[29px] leading-tight font-bold text-gray-650 mb-4">
                        Great choice, mate!
                    </h2>

                    <p className="text-[16px] font-bold text-gray-600 mb-1">
                        You're still on the path to your dream role.{' '}
                        <span className="text-purple-600 font-medium font-bold">Let's make it happen together!</span>
                    </p>

                    <p className="text-[15px] text-gray-600 mb-1 mt-6">
                        You've got XX days left on your current plan.
                    </p>
                    <p className="text-[15px] text-gray-600 mb-8">
                        Starting from XX date, your monthly payment will be ${discountedPrice}.
                    </p>

                    <p className="text-[14px] text-gray-500 italic mb-10">
                        You can cancel anytime before then.
                    </p>

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-300 mb-6"></div>

                    {/* Button */}
                    <button
                        onClick={handleFinish}
                        className="w-full py-4 px-6 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors cursor-pointer text-[16px]"
                    >
                        Land your dream role
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                {/* Desktop Header - Centered */}
                <div className="px-8 py-3 border-b border-gray-200 flex items-center justify-center relative">
                    <h1 className="text-lg font-semibold text-gray-900">Subscription Continued</h1>

                    <button
                        onClick={handleFinish}
                        className="absolute right-8 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content container - Moved closer to header with reduced padding */}
                <div className="flex px-8 md:px-6 lg:px-8 pt-6 pb-6">
                    {/* Left Side - Content */}
                    <div className="flex-1 pr-8 max-w-[600px] md:max-w-[500px] lg:max-w-[600px]">
                        <h2 className="text-[38px] md:text-[35px] lg:text-[38px] leading-tight font-bold text-gray-650 mb-4">
                            Great choice, mate!
                        </h2>

                        <p className="text-[25px] md:text-[20px] lg:text-[25px] text-gray-600 font-bold mb-6">
                            You're still on the path to your dream role.{' '}
                            <span className="text-purple-600 font-medium">Let's make it happen together!</span>
                        </p>

                        <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-800 mb-0">
                            You've got XX days left on your current plan.
                        </p>
                        <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-800 mb-6">
                            Starting from XX date, your monthly payment will be ${discountedPrice}.
                        </p>

                        <p className="text-[15px] text-gray-500 italic mb-8">
                            You can cancel anytime before then.
                        </p>

                        {/* Horizontal line */}
                        <div className="w-full border-t border-gray-300 mb-6"></div>

                        {/* Button */}
                        <button
                            onClick={handleFinish}
                            className="w-full py-4 px-6 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors cursor-pointer text-[17px]"
                        >
                            Land your dream role
                        </button>
                    </div>

                    {/* Right Side - Image */}
                    <div className="ml-8 flex items-start">
                        <div className="relative w-[420px] md:w-[350px] lg:w-[420px] overflow-hidden rounded-2xl shadow-xl"
                            style={{ height: 'calc(100% - 0px)' }}>
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