
'use client'

import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'

export function SuccessVisaHelpStep() {
    const { dispatch } = useCancellation()

    const handleFinish = () => {
        // Close the modal or redirect to dashboard
        window.location.href = '/' // or wherever you want to redirect
    }

    return (
        <>
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-base font-semibold text-gray-900">
                            Subscription Cancelled
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

                    {/* Progress indicator - All completed */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-500">Completed</span>
                        </div>
                    </div>
                </div>

                {/* Content - Moved closer to header */}
                <div className="px-6 py-4">
                    <h2 className="text-[26px] leading-tight font-bold text-gray-620 mb-4">
                        Your cancellation's all sorted, mate, no more charges.
                    </h2>

                    {/* Gray background email-like section */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        {/* Profile Section */}
                        <div className="flex items-start space-x-3 mb-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src="/mihailo-profile.jpeg"
                                    alt="Mihailo Bozic"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-[15px]">Mihailo Bozic</p>
                                <p className="text-[13px] text-gray-500">&lt;mihailo@migratemate.co&gt;</p>
                            </div>
                        </div>

                        {/* Email body content - indented to align with name */}
                        <div className="ml-[52px]">
                            <p className="text-[15px] font-bold text-gray-600 mb-3">
                                I'll be reaching out soon to help with the visa side of things.
                            </p>

                            <p className="text-[15px] text-gray-600 mb-3">
                                We've got your back, whether it's questions, paperwork, or just figuring out your options.
                            </p>

                            <p className="text-[15px] text-gray-600">
                                Keep an eye on your inbox, I'll be in touch <span className="underline">shortly</span>.
                            </p>
                        </div>
                    </div>

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-300 mb-6"></div>

                    {/* Finish Button */}
                    <button
                        onClick={handleFinish}
                        className="w-full py-4 px-6 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors cursor-pointer text-[16px]"
                    >
                        Finish
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                {/* Desktop Header - Centered content */}
                <div className="px-8 py-3 border-b border-gray-100 flex items-center justify-center relative">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-lg font-semibold text-gray-900">Subscription Cancelled</h1>

                        <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                                <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                                <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                                <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Completed</span>
                        </div>
                    </div>

                    <button
                        onClick={handleFinish}
                        className="absolute right-8 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content container - Moved closer to header */}
                <div className="flex px-8 md:px-6 lg:px-8 pt-6 pb-6">
                    {/* Left Side - Content */}
                    <div className="flex-1 pr-8 max-w-[600px] md:max-w-[500px] lg:max-w-[600px]">
                        <h2 className="text-[37px] md:text-[34px] lg:text-[37px] leading-tight font-bold text-gray-600 mb-5">
                            Your cancellation's all sorted, mate, no more charges.
                        </h2>

                        {/* Gray background email-like section */}
                        <div className="bg-gray-50 rounded-lg p-5 mb-6">
                            {/* Profile Section */}
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src="/mihailo-profile.jpeg"
                                        alt="Mihailo Bozic"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 text-[17px]">Mihailo Bozic</p>
                                    <p className="text-gray-500 text-[15px]">&lt;mihailo@migratemate.co&gt;</p>
                                </div>
                            </div>

                            {/* Email body content - indented to align with name */}
                            <div className="ml-[60px]">
                                <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-600 mb-3 leading-relaxed">
                                    I'll be reaching out soon to help with the visa side of things.
                                </p>

                                <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-600 mb-3 leading-relaxed">
                                    We've got your back, whether it's questions, paperwork, or just figuring out your options.
                                </p>

                                <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-600 leading-relaxed">
                                    Keep an eye on your inbox, I'll be in touch <span className="underline">shortly</span>.
                                </p>
                            </div>
                        </div>

                        {/* Horizontal line */}
                        <div className="w-full border-t border-gray-300 mb-6"></div>

                        {/* Finish Button */}
                        <button
                            onClick={handleFinish}
                            className="w-full py-4 px-6 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors cursor-pointer text-[17px]"
                        >
                            Finish
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