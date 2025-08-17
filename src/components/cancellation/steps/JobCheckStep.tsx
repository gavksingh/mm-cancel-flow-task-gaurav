// 'use client'

// import Image from 'next/image'
// import { useCancellation } from '@/context/CancellationContext'
// import { ModalHeader } from '../shared/ModalHeader'
// import { ErrorText } from '../../shared/ErrorText'

// export function JobCheckStep() {
//     const { state, dispatch } = useCancellation()

//     const handleJobResponse = (foundJob: boolean) => {
//         // Clear any previous errors
//         dispatch({ type: 'CLEAR_FIELD_ERROR', payload: 'job-selection' })

//         dispatch({ type: 'SET_JOB_STATUS', payload: foundJob })

//         if (foundJob) {
//             dispatch({ type: 'SET_STEP', payload: 'reason' })
//         } else {
//             dispatch({ type: 'SET_REASON', payload: 'Still job searching' })
//             dispatch({ type: 'SET_STEP', payload: 'downsell' })
//         }
//     }



//     return (
//         <>
//             <ModalHeader title="Subscription Cancellation" />

//             {/* Mobile Layout - Image at top */}
//             <div className="lg:hidden p-4">
//                 {/* Image for mobile - with padding and rounded borders */}
//                 <div className="relative w-full h-[190px] overflow-hidden rounded-xl mb-6">
//                     <Image
//                         src="/empire-state-compressed.jpg"
//                         alt="New York City skyline with Empire State Building"
//                         fill
//                         className="object-cover"
//                         priority
//                     />
//                 </div>

//                 {/* Content below image on mobile */}
//                 <div>
//                     <h1 className="text-[30px] leading-[1.15] font-bold text-gray-610 mb-4">
//                         Hey mate,<br />
//                         Quick one before you go.
//                     </h1>

//                     <p className="text-[20px] italic font-bold text-gray-700 mb-6">
//                         Have you found a job yet?
//                     </p>

//                     <p className="text-[14px] text-gray-700 mb-8 leading-[1.6]">
//                         Whatever your answer, we just want to help you take the next step.
//                         With visa support, or by hearing how we can do better.
//                     </p>

//                     {/* Horizontal separator line for mobile */}
//                     <div className="w-full border-t border-gray-300 mb-6"></div>

//                     {/* Buttons for mobile */}
//                     <div className="space-y-3">
//                         <button
//                             onClick={() => handleJobResponse(true)}
//                             className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                         >
//                             Yes, I&apos;ve found a job
//                         </button>

//                         <button
//                             onClick={() => handleJobResponse(false)}
//                             className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                         >
//                             Not yet - I&apos;m still looking
//                         </button>
//                     </div>

//                     <ErrorText message={state.fieldErrors['job-selection'] || ''} />
//                 </div>
//             </div>

//             {/* Desktop Layout - Side by side */}
//             <div className="hidden lg:flex p-8 md:p-6 lg:p-10">
//                 {/* Left Side - Text Content */}
//                 <div className="flex-1 pr-0 md:pr-8 lg:pr-10 max-w-[600px] md:max-w-[500px] lg:max-w-[600px]">
//                     <h1 className="text-[38px] md:text-[36px] lg:text-[42px] leading-[1.15] font-bold text-gray-900 mb-4">
//                         Hey mate,<br />
//                         Quick one before you go.
//                     </h1>

//                     <p className="text-[24px] md:text-[22px] lg:text-[26px] italic text-gray-700 mb-8 font-light">
//                         Have you found a job yet?
//                     </p>

//                     <p className="text-[15px] md:text-[14px] lg:text-[15px] text-gray-600 mb-10 leading-[1.6]">
//                         Whatever your answer, we just want to help you take the next step.<br />
//                         With visa support, or by hearing how we can do better.
//                     </p>

//                     {/* Horizontal separator line */}
//                     <div className="w-full border-t border-gray-200 mb-8"></div>

//                     {/* Buttons */}
//                     <div className="space-y-3">
//                         <button
//                             onClick={() => handleJobResponse(true)}
//                             className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                         >
//                             Yes, I&apos;ve found a job
//                         </button>

//                         <button
//                             onClick={() => handleJobResponse(false)}
//                             className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                         >
//                             Not yet - I&apos;m still looking
//                         </button>
//                     </div>

//                     <ErrorText message={state.fieldErrors['job-selection'] || ''} />
//                 </div>

//                 {/* Right Side - Image for desktop */}
//                 <div className="ml-8">
//                     <div className="relative w-[440px] h-[420px] md:w-[370px] md:h-[350px] lg:w-[440px] lg:h-[420px] overflow-hidden rounded-2xl">
//                         <Image
//                             src="/empire-state-compressed.jpg"
//                             alt="New York City skyline with Empire State Building"
//                             fill
//                             className="object-cover"
//                             priority
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }



'use client'

import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { ModalHeader } from '../shared/ModalHeader'
import { ErrorText } from '../../shared/ErrorText'

export function JobCheckStep() {
    const { state, dispatch } = useCancellation()

    const handleJobResponse = (foundJob: boolean) => {
        // Clear any previous errors
        dispatch({ type: 'CLEAR_FIELD_ERROR', payload: 'job-selection' })

        // Store job status for use in API
        const jobStatus = foundJob ? 'Found job' : 'Still job searching'
        dispatch({ type: 'SET_JOB_STATUS', payload: jobStatus })

        if (foundJob) {
            // If found job, go directly to reason step (skip downsell)
            dispatch({ type: 'SET_STEP', payload: 'reason' })
        } else {
            // If still searching, store status and go to downsell (for variant B)
            dispatch({ type: 'SET_REASON', payload: JSON.stringify({ jobStatus: 'Still job searching' }) })
            dispatch({ type: 'SET_STEP', payload: 'downsell' })
        }
    }

    return (
        <>
            <ModalHeader title="Subscription Cancellation" />

            {/* Mobile Layout - Image at top */}
            <div className="lg:hidden p-4">
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
                    <h1 className="text-[30px] leading-[1.15] font-bold text-gray-610 mb-4">
                        Hey mate,<br />
                        Quick one before you go.
                    </h1>

                    <p className="text-[20px] italic font-bold text-gray-700 mb-6">
                        Have you found a job yet?
                    </p>

                    <p className="text-[14px] text-gray-700 mb-8 leading-[1.6]">
                        Whatever your answer, we just want to help you take the next step.
                        With visa support, or by hearing how we can do better.
                    </p>

                    {/* Horizontal separator line for mobile */}
                    <div className="w-full border-t border-gray-300 mb-6"></div>

                    {/* Buttons for mobile */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleJobResponse(true)}
                            className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            Yes, I&apos;ve found a job
                        </button>

                        <button
                            onClick={() => handleJobResponse(false)}
                            className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            Not yet - I&apos;m still looking
                        </button>
                    </div>

                    <ErrorText message={state.fieldErrors['job-selection'] || ''} />
                </div>
            </div>

            {/* Desktop Layout - Side by side */}
            <div className="hidden lg:flex p-8 md:p-6 lg:p-10">
                {/* Left Side - Text Content */}
                <div className="flex-1 pr-0 md:pr-8 lg:pr-10 max-w-[600px] md:max-w-[500px] lg:max-w-[600px]">
                    <h1 className="text-[38px] md:text-[36px] lg:text-[42px] leading-[1.15] font-bold text-gray-900 mb-4">
                        Hey mate,<br />
                        Quick one before you go.
                    </h1>

                    <p className="text-[24px] md:text-[22px] lg:text-[26px] italic text-gray-700 mb-8 font-light">
                        Have you found a job yet?
                    </p>

                    <p className="text-[15px] md:text-[14px] lg:text-[15px] text-gray-600 mb-10 leading-[1.6]">
                        Whatever your answer, we just want to help you take the next step.<br />
                        With visa support, or by hearing how we can do better.
                    </p>

                    {/* Horizontal separator line */}
                    <div className="w-full border-t border-gray-200 mb-8"></div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleJobResponse(true)}
                            className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            Yes, I&apos;ve found a job
                        </button>

                        <button
                            onClick={() => handleJobResponse(false)}
                            className={`w-full py-4 px-6 bg-white border text-[15px] text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer ${state.fieldErrors['job-selection'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            Not yet - I&apos;m still looking
                        </button>
                    </div>

                    <ErrorText message={state.fieldErrors['job-selection'] || ''} />
                </div>

                {/* Right Side - Image for desktop */}
                <div className="ml-8">
                    <div className="relative w-[440px] h-[420px] md:w-[370px] md:h-[350px] lg:w-[440px] lg:h-[420px] overflow-hidden rounded-2xl">
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