// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import { useCancellation } from '@/context/CancellationContext'
// import { useCancellationFlow } from '@/hooks/useCancellationFlow'

// export function SurveyStep() {
//     const { state, dispatch } = useCancellation()
//     const { submitCancellation, isSubmitting } = useCancellationFlow()
//     const [isProcessing, setIsProcessing] = useState(false)
//     const [showRedText, setShowRedText] = useState(false)

//     // Survey answers state
//     const [rolesApplied, setRolesApplied] = useState<string | null>(null)
//     const [companiesEmailed, setCompaniesEmailed] = useState<string | null>(null)
//     const [companiesInterviewed, setCompaniesInterviewed] = useState<string | null>(null)

//     // Check if all options are selected
//     const allOptionsSelected = rolesApplied && companiesEmailed && companiesInterviewed

//     // Calculate the discounted price
//     const discountedPrice = (state.originalPrice / 200).toFixed(2) // 50% off
//     const originalPrice = (state.originalPrice / 100).toFixed(0)

//     const handleGetOffer = async () => {
//         setIsProcessing(true)
//         try {
//             // Store survey data with the cancellation
//             const surveyData = {
//                 rolesApplied,
//                 companiesEmailed,
//                 companiesInterviewed,
//                 acceptedAfterSurvey: true
//             }

//             // Parse existing reason data safely
//             let existingData = {}
//             try {
//                 if (state.selectedReason) {
//                     existingData = JSON.parse(state.selectedReason)
//                 }
//             } catch (e) {
//                 // If it's not JSON, treat it as a plain string reason
//                 existingData = { reason: state.selectedReason }
//             }

//             await submitCancellation(
//                 JSON.stringify({
//                     ...existingData,
//                     survey: surveyData
//                 }),
//                 true, // accepting downsell after survey
//                 state.variant
//             )

//             dispatch({ type: 'SET_STEP', payload: 'success-downsell' })
//         } catch (error) {
//             console.error('Error accepting offer:', error)
//             alert('There was an error processing your request. Please try again.')
//         } finally {
//             setIsProcessing(false)
//         }
//     }

//     const handleContinue = () => {
//         // Show red text after first attempt
//         if (!allOptionsSelected) {
//             setShowRedText(true)
//             return
//         }

//         // Store survey data without submitting cancellation
//         const surveyData = {
//             rolesApplied,
//             companiesEmailed,
//             companiesInterviewed
//         }

//         // Store survey data in state for later use
//         dispatch({ type: 'SET_REASON', payload: JSON.stringify({ survey: surveyData }) })

//         // Navigate to cancellation-reason step
//         dispatch({ type: 'SET_STEP', payload: 'cancellation-reason' })
//     }

//     const handleBack = () => {
//         dispatch({ type: 'SET_STEP', payload: 'downsell' })
//     }

//     return (
//         <>
//             {/* Mobile Layout */}
//             <div className="lg:hidden">
//                 {/* Mobile Header */}
//                 <div className="px-6 py-3 border-b border-gray-100">
//                     <div className="flex items-center justify-between mb-2">
//                         <h1 className="text-base font-semibold text-gray-900">
//                             Subscription Cancellation
//                         </h1>

//                         <button
//                             onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
//                             className="text-gray-400 hover:text-gray-600 cursor-pointer"
//                         >
//                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>

//                     {/* Progress indicator */}
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                             <div className="flex space-x-1">
//                                 <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
//                                 <div className="w-6 h-1.5 bg-gray-400 rounded-full"></div>
//                                 <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
//                             </div>
//                             <span className="text-xs text-gray-500">Step 2 of 3</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Back button */}
//                 <div className="px-4 py-2">
//                     <button
//                         onClick={handleBack}
//                         className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
//                     >
//                         <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                         </svg>
//                         <span className="text-sm font-medium">Back</span>
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div className="px-6 py-4">
//                     <h2 className="text-[24px] leading-tight font-bold text-gray-650 mb-5">
//                         What's the main reason for cancelling?
//                     </h2>

//                     {/* Horizontal line */}
//                     <div className="w-full border-t border-gray-300 mb-5"></div>

//                     {showRedText && (
//                         <div className="mb-4">
//                             <p className="text-[14px] text-red-600">
//                                 Mind letting us know why you're cancelling?
//                             </p>
//                             <p className="text-[14px] text-red-600">
//                                 It helps us understand your experience and improve the platform.*
//                             </p>
//                         </div>
//                     )}

//                     {/* Survey Questions */}
//                     <div className="space-y-6 mb-8">
//                         {/* Question 1 */}
//                         <div>
//                             <p className="text-[15px] text-gray-700 mb-3">
//                                 How many roles did you <span className="underline">apply</span> for through Migrate Mate?*
//                             </p>
//                             <div className="flex gap-3">
//                                 {['0', '1 - 5', '6 - 20', '20+'].map((option) => (
//                                     <button
//                                         key={option}
//                                         onClick={() => setRolesApplied(option)}
//                                         className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${rolesApplied === option
//                                             ? 'border-gray-900 bg-gray-900 text-white'
//                                             : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                                             }`}
//                                     >
//                                         {option}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Question 2 */}
//                         <div>
//                             <p className="text-[15px] text-gray-700 mb-3">
//                                 How many companies did you <span className="underline">email</span> directly?
//                             </p>
//                             <div className="flex gap-3">
//                                 {['0', '1-5', '6-20', '20+'].map((option) => (
//                                     <button
//                                         key={option}
//                                         onClick={() => setCompaniesEmailed(option)}
//                                         className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${companiesEmailed === option
//                                             ? 'border-gray-900 bg-gray-900 text-white'
//                                             : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                                             }`}
//                                     >
//                                         {option}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Question 3 */}
//                         <div>
//                             <p className="text-[15px] text-gray-700 mb-3">
//                                 How many different companies did you <span className="underline">interview</span> with?
//                             </p>
//                             <div className="flex gap-3">
//                                 {['0', '1-2', '3-5', '5+'].map((option) => (
//                                     <button
//                                         key={option}
//                                         onClick={() => setCompaniesInterviewed(option)}
//                                         className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${companiesInterviewed === option
//                                             ? 'border-gray-900 bg-gray-900 text-white'
//                                             : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                                             }`}
//                                     >
//                                         {option}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Horizontal line */}
//                     <div className="w-full border-t border-gray-300 mb-5"></div>

//                     {/* Buttons */}
//                     <button
//                         onClick={handleGetOffer}
//                         disabled={isProcessing || isSubmitting}
//                         className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer mb-3"
//                     >
//                         Get 50% off | ${discountedPrice} <span className="line-through text-green-200">${originalPrice}</span>
//                     </button>

//                     <button
//                         onClick={handleContinue}
//                         disabled={isProcessing || isSubmitting}
//                         className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${allOptionsSelected
//                             ? 'bg-red-600 text-white hover:bg-red-700'
//                             : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                             }`}
//                     >
//                         Continue
//                     </button>
//                 </div>
//             </div>

//             {/* Desktop Layout */}
//             <div className="hidden lg:block">
//                 {/* Desktop Header */}
//                 <div className="px-8 py-3 border-b border-gray-100 flex items-center justify-between">
//                     <button
//                         onClick={handleBack}
//                         className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
//                     >
//                         <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                         </svg>
//                         <span className="text-sm font-medium">Back</span>
//                     </button>

//                     <div className="flex items-center space-x-6">
//                         <h1 className="text-lg font-semibold text-gray-900">Subscription Cancellation</h1>

//                         <div className="flex items-center space-x-3">
//                             <div className="flex space-x-1">
//                                 <div className="w-8 h-2 bg-green-500 rounded-full"></div>
//                                 <div className="w-8 h-2 bg-gray-400 rounded-full"></div>
//                                 <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
//                             </div>
//                             <span className="text-sm text-gray-500">Step 2 of 3</span>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
//                         className="text-gray-400 hover:text-gray-600 cursor-pointer"
//                     >
//                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                     </button>
//                 </div>

//                 <div className="flex p-8 md:p-6 lg:p-8">
//                     {/* Left Side - Content with flex column */}
//                     <div className="flex-1 pr-8 max-w-[600px] md:max-w-[500px] lg:max-w-[600px] flex flex-col">
//                         <h2 className="text-[30px] md:text-[28px] lg:text-[30px] leading-tight font-bold text-gray-650 mb-5">
//                             Help us understand how you were using Migrate Mate.
//                         </h2>

//                         {showRedText && (
//                             <div className="mb-6">
//                                 <p className="text-[15px] text-red-600">
//                                     Mind letting us know why you're cancelling?
//                                 </p>
//                                 <p className="text-[15px] text-red-600">
//                                     It helps us understand your experience and improve the platform.*
//                                 </p>
//                             </div>
//                         )}

//                         {/* Survey Questions */}
//                         <div className="space-y-6 mb-8">
//                             {/* Question 1 */}
//                             <div>
//                                 <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-3">
//                                     How many roles did you <span className="underline">apply</span> for through Migrate Mate?
//                                 </p>
//                                 <div className="flex gap-3">
//                                     {['0', '1 - 5', '6 - 20', '20+'].map((option) => (
//                                         <button
//                                             key={option}
//                                             onClick={() => setRolesApplied(option)}
//                                             className={`flex-1 py-3 px-4 rounded-lg border-2 text-[15px] font-medium transition-colors cursor-pointer ${rolesApplied === option
//                                                 ? 'border-gray-900 bg-gray-900 text-white'
//                                                 : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                                                 }`}
//                                         >
//                                             {option}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Question 2 */}
//                             <div>
//                                 <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-3">
//                                     How many companies did you <span className="underline">email</span> directly?
//                                 </p>
//                                 <div className="flex gap-3">
//                                     {['0', '1-5', '6-20', '20+'].map((option) => (
//                                         <button
//                                             key={option}
//                                             onClick={() => setCompaniesEmailed(option)}
//                                             className={`flex-1 py-3 px-4 rounded-lg border-2 text-[15px] font-medium transition-colors cursor-pointer ${companiesEmailed === option
//                                                 ? 'border-gray-900 bg-gray-900 text-white'
//                                                 : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                                                 }`}
//                                         >
//                                             {option}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Question 3 */}
//                             <div>
//                                 <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-3">
//                                     How many different companies did you <span className="underline">interview</span> with?
//                                 </p>
//                                 <div className="flex gap-3">
//                                     {['0', '1-2', '3-5', '5+'].map((option) => (
//                                         <button
//                                             key={option}
//                                             onClick={() => setCompaniesInterviewed(option)}
//                                             className={`flex-1 py-3 px-4 rounded-lg border-2 text-[15px] font-medium transition-colors cursor-pointer ${companiesInterviewed === option
//                                                 ? 'border-gray-900 bg-gray-900 text-white'
//                                                 : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                                                 }`}
//                                         >
//                                             {option}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Spacer to push buttons to bottom */}
//                         <div className="flex-grow"></div>

//                         {/* Horizontal line */}
//                         <div className="w-full border-t border-gray-300 mb-5"></div>

//                         {/* Buttons at the bottom */}
//                         <div>
//                             <button
//                                 onClick={handleGetOffer}
//                                 disabled={isProcessing || isSubmitting}
//                                 className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer mb-3"
//                             >
//                                 Get 50% off | ${discountedPrice} <span className="line-through text-green-200">${originalPrice}</span>
//                             </button>

//                             <button
//                                 onClick={handleContinue}
//                                 disabled={isProcessing || isSubmitting}
//                                 className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${allOptionsSelected
//                                     ? 'bg-red-600 text-white hover:bg-red-700'
//                                     : 'bg-gray-300 text-gray-500 hover:bg-gray-300'
//                                     }`}
//                             >
//                                 Continue
//                             </button>
//                         </div>
//                     </div>

//                     {/* Right Side - Image with dynamic height */}
//                     <div className="ml-8">
//                         <div className="relative w-[420px] md:w-[350px] lg:w-[420px] h-full overflow-hidden rounded-2xl shadow-xl">
//                             <Image
//                                 src="/empire-state-compressed.jpg"
//                                 alt="New York City skyline"
//                                 fill
//                                 className="object-cover"
//                                 priority
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }




'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { useCancellationFlow } from '@/hooks/useCancellationFlow'

export function SurveyStep() {
    const { state, dispatch } = useCancellation()
    const { submitCancellation, isSubmitting } = useCancellationFlow()
    const [isProcessing, setIsProcessing] = useState(false)
    const [showRedText, setShowRedText] = useState(false)

    // Survey answers state
    const [rolesApplied, setRolesApplied] = useState<string | null>(null)
    const [companiesEmailed, setCompaniesEmailed] = useState<string | null>(null)
    const [companiesInterviewed, setCompaniesInterviewed] = useState<string | null>(null)

    // Check if all options are selected
    const allOptionsSelected = rolesApplied && companiesEmailed && companiesInterviewed

    // Calculate the discounted price
    const discountedPrice = (state.originalPrice / 200).toFixed(2) // 50% off
    const originalPrice = (state.originalPrice / 100).toFixed(0)

    const handleGetOffer = async () => {
        setIsProcessing(true)
        try {
            // Store survey data with the cancellation
            const surveyData = {
                rolesApplied,
                companiesEmailed,
                companiesInterviewed
            }

            // Parse existing reason data safely
            let existingData = {}
            try {
                if (state.selectedReason) {
                    existingData = JSON.parse(state.selectedReason)
                }
            } catch (e) {
                // If it's not JSON, treat it as a plain string reason
                existingData = { reason: state.selectedReason }
            }

            await submitCancellation(
                JSON.stringify({
                    ...existingData,
                    survey: surveyData,
                    jobStatus: state.jobStatus || 'Still job searching',
                    acceptedAfterSurvey: true
                }),
                true, // accepting downsell after survey
                state.variant
            )

            dispatch({ type: 'SET_STEP', payload: 'success-downsell' })
        } catch (error) {
            console.error('Error accepting offer:', error)
            alert('There was an error processing your request. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleContinue = () => {
        // Show red text after first attempt
        if (!allOptionsSelected) {
            setShowRedText(true)
            return
        }

        // Store survey data without submitting cancellation
        const surveyData = {
            rolesApplied,
            companiesEmailed,
            companiesInterviewed
        }

        // Parse existing reason data and merge with survey
        let existingData = {}
        try {
            if (state.selectedReason) {
                existingData = JSON.parse(state.selectedReason)
            }
        } catch (e) {
            existingData = {}
        }

        // Store survey data in state for later use (merge with existing data)
        dispatch({
            type: 'SET_REASON', payload: JSON.stringify({
                ...existingData,
                survey: surveyData,
                jobStatus: state.jobStatus || 'Still job searching'
            })
        })

        // Navigate to cancellation-reason step
        dispatch({ type: 'SET_STEP', payload: 'cancellation-reason' })
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'downsell' })
    }

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
                                <div className="w-6 h-1.5 bg-gray-400 rounded-full"></div>
                                <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-500">Step 2 of 3</span>
                        </div>
                    </div>
                </div>

                {/* Back button */}
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
                <div className="px-6 py-4">
                    <h2 className="text-[24px] leading-tight font-bold text-gray-650 mb-5">
                        What's the main reason for cancelling?
                    </h2>

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-300 mb-5"></div>

                    {showRedText && (
                        <div className="mb-4">
                            <p className="text-[14px] text-red-600">
                                Mind letting us know why you're cancelling?
                            </p>
                            <p className="text-[14px] text-red-600">
                                It helps us understand your experience and improve the platform.*
                            </p>
                        </div>
                    )}

                    {/* Survey Questions */}
                    <div className="space-y-6 mb-8">
                        {/* Question 1 */}
                        <div>
                            <p className="text-[15px] text-gray-700 mb-3">
                                How many roles did you <span className="underline">apply</span> for through Migrate Mate?*
                            </p>
                            <div className="flex gap-3">
                                {['0', '1 - 5', '6 - 20', '20+'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setRolesApplied(option)}
                                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${rolesApplied === option
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div>
                            <p className="text-[15px] text-gray-700 mb-3">
                                How many companies did you <span className="underline">email</span> directly?
                            </p>
                            <div className="flex gap-3">
                                {['0', '1-5', '6-20', '20+'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setCompaniesEmailed(option)}
                                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${companiesEmailed === option
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question 3 */}
                        <div>
                            <p className="text-[15px] text-gray-700 mb-3">
                                How many different companies did you <span className="underline">interview</span> with?
                            </p>
                            <div className="flex gap-3">
                                {['0', '1-2', '3-5', '5+'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setCompaniesInterviewed(option)}
                                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${companiesInterviewed === option
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-300 mb-5"></div>

                    {/* Buttons */}
                    <button
                        onClick={handleGetOffer}
                        disabled={isProcessing || isSubmitting}
                        className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer mb-3"
                    >
                        Get 50% off | ${discountedPrice} <span className="line-through text-green-200">${originalPrice}</span>
                    </button>

                    <button
                        onClick={handleContinue}
                        disabled={isProcessing || isSubmitting}
                        className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${allOptionsSelected
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        Continue
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
                                <div className="w-8 h-2 bg-gray-400 rounded-full"></div>
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Step 2 of 3</span>
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
                    {/* Left Side - Content with flex column */}
                    <div className="flex-1 pr-8 max-w-[600px] md:max-w-[500px] lg:max-w-[600px] flex flex-col">
                        <h2 className="text-[30px] md:text-[28px] lg:text-[30px] leading-tight font-bold text-gray-650 mb-5">
                            Help us understand how you were using Migrate Mate.
                        </h2>

                        {showRedText && (
                            <div className="mb-6">
                                <p className="text-[15px] text-red-600">
                                    Mind letting us know why you're cancelling?
                                </p>
                                <p className="text-[15px] text-red-600">
                                    It helps us understand your experience and improve the platform.*
                                </p>
                            </div>
                        )}

                        {/* Survey Questions */}
                        <div className="space-y-6 mb-8">
                            {/* Question 1 */}
                            <div>
                                <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-3">
                                    How many roles did you <span className="underline">apply</span> for through Migrate Mate?
                                </p>
                                <div className="flex gap-3">
                                    {['0', '1 - 5', '6 - 20', '20+'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setRolesApplied(option)}
                                            className={`flex-1 py-3 px-4 rounded-lg border-2 text-[15px] font-medium transition-colors cursor-pointer ${rolesApplied === option
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Question 2 */}
                            <div>
                                <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-3">
                                    How many companies did you <span className="underline">email</span> directly?
                                </p>
                                <div className="flex gap-3">
                                    {['0', '1-5', '6-20', '20+'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setCompaniesEmailed(option)}
                                            className={`flex-1 py-3 px-4 rounded-lg border-2 text-[15px] font-medium transition-colors cursor-pointer ${companiesEmailed === option
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Question 3 */}
                            <div>
                                <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-3">
                                    How many different companies did you <span className="underline">interview</span> with?
                                </p>
                                <div className="flex gap-3">
                                    {['0', '1-2', '3-5', '5+'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setCompaniesInterviewed(option)}
                                            className={`flex-1 py-3 px-4 rounded-lg border-2 text-[15px] font-medium transition-colors cursor-pointer ${companiesInterviewed === option
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Spacer to push buttons to bottom */}
                        <div className="flex-grow"></div>

                        {/* Horizontal line */}
                        <div className="w-full border-t border-gray-300 mb-5"></div>

                        {/* Buttons at the bottom */}
                        <div>
                            <button
                                onClick={handleGetOffer}
                                disabled={isProcessing || isSubmitting}
                                className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer mb-3"
                            >
                                Get 50% off | ${discountedPrice} <span className="line-through text-green-200">${originalPrice}</span>
                            </button>

                            <button
                                onClick={handleContinue}
                                disabled={isProcessing || isSubmitting}
                                className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${allOptionsSelected
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-300 text-gray-500 hover:bg-gray-300'
                                    }`}
                            >
                                Continue
                            </button>
                        </div>
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