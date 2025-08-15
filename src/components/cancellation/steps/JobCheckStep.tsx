'use client'

import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { ModalHeader } from '../shared/ModalHeader'

export function JobCheckStep() {
    const { dispatch } = useCancellation()

    const handleJobResponse = (foundJob: boolean) => {
        dispatch({ type: 'SET_JOB_STATUS', payload: foundJob })

        if (foundJob) {
            dispatch({ type: 'SET_STEP', payload: 'reason' })
        } else {
            dispatch({ type: 'SET_REASON', payload: 'Still job searching' })
            dispatch({ type: 'SET_STEP', payload: 'downsell' })
        }
    }

    return (
        <>
            <ModalHeader title="Subscription Cancellation" />

            {/* Mobile Layout - Image at top */}
            <div className="md:hidden p-4">
                {/* Image for mobile - with padding and rounded borders */}
                <div className="relative w-full h-[190px] overflow-hidden rounded-xl mb-6">
                    <Image
                        src="/empire-state-compressed.jpg"
                        alt="New York City skyline with Empire State Building"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content below image on mobile */}
                <div>
                    <h1 className="text-[32px] leading-[1.15] font-bold text-gray-900 mb-4">
                        Hey mate,<br />
                        Quick one before you go.
                    </h1>

                    <p className="text-[20px] italic text-gray-700 mb-6 font-light">
                        Have you found a job yet?
                    </p>

                    <p className="text-[14px] text-gray-600 mb-8 leading-[1.6]">
                        Whatever your answer, we just want to help you take the next step.
                        With visa support, or by hearing how we can do better.
                    </p>

                    {/* Horizontal separator line for mobile */}
                    <div className="w-full border-t border-gray-200 mb-6"></div>

                    {/* Buttons for mobile */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleJobResponse(true)}
                            className="w-full py-4 px-6 bg-white border border-gray-300 text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg"
                        >
                            Yes, I've found a job
                        </button>

                        <button
                            onClick={() => handleJobResponse(false)}
                            className="w-full py-4 px-6 bg-white border border-gray-300 text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg"
                        >
                            Not yet - I'm still looking
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Layout - Side by side */}
            <div className="hidden md:flex p-8 md:p-10">
                {/* Left Side - Text Content */}
                <div className="flex-1 pr-0 md:pr-10">
                    <h1 className="text-[38px] md:text-[42px] leading-[1.15] font-bold text-gray-900 mb-4">
                        Hey mate,<br />
                        Quick one before you go.
                    </h1>

                    <p className="text-[24px] md:text-[26px] italic text-gray-700 mb-8 font-light">
                        Have you found a job yet?
                    </p>

                    <p className="text-[15px] text-gray-600 mb-10 leading-[1.6]">
                        Whatever your answer, we just want to help you take the next step.<br />
                        With visa support, or by hearing how we can do better.
                    </p>

                    {/* Horizontal separator line */}
                    <div className="w-full border-t border-gray-200 mb-8"></div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleJobResponse(true)}
                            className="w-full py-4 px-6 bg-white border border-gray-300 text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg"
                        >
                            Yes, I've found a job
                        </button>

                        <button
                            onClick={() => handleJobResponse(false)}
                            className="w-full py-4 px-6 bg-white border border-gray-300 text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg"
                        >
                            Not yet - I'm still looking
                        </button>
                    </div>
                </div>

                {/* Right Side - Image for desktop */}
                <div className="ml-8">
                    <div className="relative w-[440px] h-[420px] overflow-hidden rounded-2xl">
                        <Image
                            src="/empire-state-compressed.jpg"
                            alt="New York City skyline with Empire State Building"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </>
    )
}