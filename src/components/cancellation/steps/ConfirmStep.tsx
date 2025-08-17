'use client'

import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { useRouter } from 'next/navigation'

export function ConfirmStep() {
    const { dispatch } = useCancellation()
    const router = useRouter()

    const handleBackToJobs = () => {
        router.push('/')
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'cancellation-reason' })
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
                            onClick={() => router.push('/jobs')}
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

                {/* Mobile Content */}
                <div className="p-6">
                    {/* Image */}
                    <div className="relative w-full h-48 mb-6 overflow-hidden rounded-xl">
                        <Image
                            src="/empire-state-compressed.jpg"
                            alt="New York City skyline"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <h2 className="text-[26px] leading-tight font-bold text-gray-700 mb-4">
                        Sorry to see you go, mate.
                    </h2>

                    <p className="text-[16px] font-bold text-gray-600 mb-6">
                        Thanks for being with us, and you're always welcome back.
                    </p>

                    <p className="text-[15px] font-medium text-gray-600 mb-0">
                        Your subscription is set to end on XX date.
                    </p>
                    <p className="text-[15px] font-medium text-gray-800 mb-6">
                        You'll still have full access until then. No further charges after that.
                    </p>

                    <p className="text-[14px] text-gray-500 mb-8">
                        Changed your mind?
                        <br />
                        You can reactivate anytime before your end date.
                    </p>

                    <div className="h-px bg-gray-300 my-6"></div>

                    <button
                        onClick={handleBackToJobs}
                        className="w-full py-3.5 px-6 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                    >
                        Back to Jobs
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
                        onClick={() => router.push('/jobs')}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Desktop Content */}
                <div className="flex p-8 md:p-6 lg:p-8">
                    {/* Left Side - Content */}
                    <div className="flex-1 pr-8 max-w-[600px] md:max-w-[500px] lg:max-w-[600px]">
                        <h2 className="text-[40px] md:text-[36px] lg:text-[40px] leading-tight font-bold text-gray-600 mb-4">
                            Sorry to see you go, mate.
                        </h2>

                        <p className="text-[22px] md:text-[18px] lg:text-[22px] text-gray-600 font-bold leading-relaxed mb-6">
                            Thanks for being with us, and you're always welcome back.
                        </p>

                        <div className="mb-8">
                            <p className="text-[16px] text-gray-700 mb-0">
                                Your subscription is set to end on XX date.
                            </p>
                            <p className="text-[16px] text-gray-700">
                                You'll still have full access until then. No further charges after that.
                            </p>
                        </div>

                        <p className="text-[15px] text-gray-500 mb-12">
                            Changed your mind? You can reactivate anytime before your end date.
                        </p>
                        <div className="h-px bg-gray-300 mb-6"></div>

                        {/* Back to Jobs Button */}
                        <button
                            onClick={handleBackToJobs}
                            className="w-full py-3 px-6 bg-purple-500 text-white font-semibold text-lg rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                        >
                            Back to Jobs
                        </button>
                    </div>

                    {/* Right Side - Image with dynamic height */}
                    <div className="ml-8">
                        <div className="relative w-[420px] md:w-[350px] lg:w-[420px] h-full overflow-hidden rounded-2xl shadow-xl">
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