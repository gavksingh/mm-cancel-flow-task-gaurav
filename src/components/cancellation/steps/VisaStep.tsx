// 'use client'

// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { useCancellation } from '@/context/CancellationContext'
// import { useCancellationFlow } from '@/hooks/useCancellationFlow'
// import { useSubscription } from '@/hooks/useSubscription'
// import { ErrorText } from '../../shared/ErrorText'

// export function VisaStep() {
//     const { state, dispatch } = useCancellation()
//     const { submitCancellation, isSubmitting } = useCancellationFlow()
//     const { fetchSubscriptionInfo } = useSubscription()
//     const [visaAssistance, setVisaAssistance] = useState<'yes' | 'no' | null>(null)
//     const [isProcessing, setIsProcessing] = useState(false)

//     // Fetch subscription info on mount if not already fetched
//     useEffect(() => {
//         fetchSubscriptionInfo()
//     }, [])

//     const handleCompleteCancellation = async () => {
//         if (!visaAssistance) {
//             dispatch({
//                 type: 'SET_FIELD_ERROR',
//                 payload: { field: 'visa_assistance', message: 'Please select an option to continue' }
//             })
//             return
//         }

//         setIsProcessing(true)
//         try {
//             // Parse existing reason data and add visa assistance info
//             const reasonData = JSON.parse(state.selectedReason || '{}')
//             const updatedReason = {
//                 ...reasonData,
//                 visaAssistance: visaAssistance === 'yes'
//             }

//             // Submit cancellation with all collected data
//             await submitCancellation(
//                 JSON.stringify(updatedReason),
//                 false, // not accepting downsell since they found a job through MM
//                 state.variant
//             )

//             dispatch({ type: 'SET_STEP', payload: 'success' })
//         } catch (error) {
//             console.error('Error completing cancellation:', error)
//             // Show error to user
//             alert('There was an error processing your cancellation. Please try again.')
//         } finally {
//             setIsProcessing(false)
//         }
//     }

//     const handleBack = () => {
//         dispatch({ type: 'SET_STEP', payload: 'feedback' })
//     }

//     // Custom Radio Button Component
//     const RadioButton = ({ value, label }: { value: 'yes' | 'no', label: string }) => (
//         <label
//             className="flex items-center cursor-pointer"
//             onClick={() => {
//                 dispatch({ type: 'CLEAR_FIELD_ERROR', payload: 'visa_assistance' })
//                 setVisaAssistance(value)
//             }}
//         >
//             <div className="relative">
//                 <div className={`w-5 h-5 rounded-full border-2 transition-colors ${visaAssistance === value
//                     ? 'border-blue-500'
//                     : 'border-gray-300'
//                     }`}>
//                     {visaAssistance === value && (
//                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full" />
//                     )}
//                 </div>
//             </div>
//             <span className="ml-3 text-gray-700 select-none">{label}</span>
//         </label>
//     )

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
//                                 <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
//                                 <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
//                             </div>
//                             <span className="text-xs text-gray-500">Step 3 of 3</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Back button */}
//                 <div className="px-3 py-2">
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
//                 <div className="px-4 py-2">
//                     <h2 className="text-[23px] leading-tight font-bold text-gray-600 mb-6">
//                         We helped you land the job, now<br />
//                         let's help you secure your visa.
//                     </h2>
//                     {/* Horizontal line */}
//                     <div className="w-full border-t border-gray-300 mb-5"></div>

//                     <p className="text-[15px] text-gray-800 mb-6">
//                         Is your company providing an immigration lawyer to help with your visa?*
//                     </p>

//                     {/* Custom Radio buttons */}
//                     <div className="mb-8">
//                         <div className={`space-y-3 ${state.fieldErrors['visa_assistance'] ? 'p-3 border-2 border-red-500 rounded-lg bg-red-50' : ''}`}>
//                             <RadioButton value="yes" label="Yes" />
//                             <RadioButton value="no" label="No" />
//                         </div>
//                         {state.fieldErrors['visa_assistance'] && (
//                             <p className="text-red-600 text-sm mt-2 font-medium">
//                                 ⚠️ {state.fieldErrors['visa_assistance']}
//                             </p>
//                         )}
//                     </div>

//                     {/* <ErrorText message={state.fieldErrors['visa_assistance'] || ''} /> */}

//                     {/* Horizontal line */}
//                     <div className="w-full border-t border-gray-200 mb-6"></div>

//                     {/* Complete cancellation Button */}
//                     <button
//                         onClick={handleCompleteCancellation}
//                         disabled={!visaAssistance || isProcessing || isSubmitting}
//                         className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all cursor-pointer ${visaAssistance && !isProcessing && !isSubmitting
//                             ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                             }`}
//                     >
//                         {isProcessing || isSubmitting ? 'Processing...' : 'Complete cancellation'}
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
//                                 <div className="w-8 h-2 bg-green-500 rounded-full"></div>
//                                 <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
//                             </div>
//                             <span className="text-sm text-gray-500">Step 3 of 3</span>
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
//                     {/* Left Side - Content */}
//                     <div className="flex-1 pr-6 max-w-[600px] md:max-w-[500px] lg:max-w-[600px]">
//                         <h2 className="text-[35px] md:text-[32px] lg:text-[35px] leading-tight font-bold text-gray-600 mb-5">
//                             We helped you land the job, now<br />
//                             let's help you secure your visa.
//                         </h2>

//                         <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-8">
//                             Is your company providing an immigration lawyer to help with your visa?*
//                         </p>

//                         {/* Custom Radio buttons */}
//                         <div className="mb-8">
//                             <div className={`space-y-3 ${state.fieldErrors['visa_assistance'] ? 'p-3 border-2 border-red-500 rounded-lg bg-red-50' : ''}`}>
//                                 <RadioButton value="yes" label="Yes" />
//                                 <RadioButton value="no" label="No" />
//                             </div>
//                             {state.fieldErrors['visa_assistance'] && (
//                                 <p className="text-red-600 text-sm mt-2 font-medium">
//                                     ⚠️ {state.fieldErrors['visa_assistance']}
//                                 </p>
//                             )}
//                         </div>

//                         {/* <ErrorText message={state.fieldErrors['visa_assistance'] || ''} /> */}

//                         {/* Horizontal line */}
//                         <div className="w-full border-t border-gray-200 mb-6"></div>

//                         {/* Complete cancellation Button */}
//                         <button
//                             onClick={handleCompleteCancellation}
//                             disabled={!visaAssistance || isProcessing || isSubmitting}
//                             className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all cursor-pointer ${visaAssistance && !isProcessing && !isSubmitting
//                                 ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 }`}
//                         >
//                             {isProcessing || isSubmitting ? 'Processing...' : 'Complete cancellation'}
//                         </button>
//                     </div>

//                     {/* Right Side - Image */}
//                     <div className="ml-8">
//                         <div className="relative w-[420px] h-[345px] md:w-[350px] md:h-[290px] lg:w-[420px] lg:h-[345px] overflow-hidden rounded-2xl shadow-xl">
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

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { useCancellationFlow } from '@/hooks/useCancellationFlow'
import { useSubscription } from '@/hooks/useSubscription'

export function VisaStep() {
    const { state, dispatch } = useCancellation()
    const { submitCancellation, isSubmitting } = useCancellationFlow()
    const { fetchSubscriptionInfo } = useSubscription()
    const [visaAssistance, setVisaAssistance] = useState<'yes' | 'no' | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    // Fetch subscription info on mount
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

        setIsProcessing(true)
        try {
            // Parse existing reason data and add visa assistance info
            const reasonData = JSON.parse(state.selectedReason || '{}')
            const updatedReason = {
                ...reasonData,
                visaAssistance: visaAssistance === 'yes'
            }

            // Submit cancellation with all collected data
            await submitCancellation(
                JSON.stringify(updatedReason),
                false, // not accepting downsell since they found a job through MM
                state.variant
            )

            dispatch({ type: 'SET_STEP', payload: 'success' })
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
                        ? 'border-blue-500'
                        : 'border-gray-300'
                    }`}>
                    {visaAssistance === value && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full" />
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
                <div className="px-3 py-2">
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
                <div className="px-4 py-2">
                    <h2 className="text-[23px] leading-tight font-bold text-gray-600 mb-6">
                        We helped you land the job, now<br />
                        let's help you secure your visa.
                    </h2>

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-300 mb-5"></div>

                    <p className="text-[15px] text-gray-800 mb-6">
                        Is your company providing an immigration lawyer to help with your visa?*
                    </p>

                    {/* Custom Radio buttons with error */}
                    <div className="mb-8">
                        <div className={`space-y-3 ${localError ? 'p-3 border-2 border-red-500 rounded-lg bg-red-50' : ''}`}>
                            <RadioButton value="yes" label="Yes" />
                            <RadioButton value="no" label="No" />
                        </div>
                        {localError && (
                            <p className="text-red-600 text-sm mt-2 font-medium">
                                ⚠️ {localError}
                            </p>
                        )}
                    </div>

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
                        <h2 className="text-[35px] md:text-[32px] lg:text-[35px] leading-tight font-bold text-gray-600 mb-5">
                            We helped you land the job, now<br />
                            let's help you secure your visa.
                        </h2>

                        <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-8">
                            Is your company providing an immigration lawyer to help with your visa?*
                        </p>

                        {/* Custom Radio buttons with error */}
                        <div className="mb-8">
                            <div className={`space-y-4 ${localError ? 'p-3 border-2 border-red-500 rounded-lg bg-red-50' : ''}`}>
                                <RadioButton value="yes" label="Yes" />
                                <RadioButton value="no" label="No" />
                            </div>
                            {localError && (
                                <p className="text-red-600 text-sm mt-2 font-medium">
                                    ⚠️ {localError}
                                </p>
                            )}
                        </div>

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
                        <div className="relative w-[420px] h-[345px] md:w-[350px] md:h-[290px] lg:w-[420px] lg:h-[345px] overflow-hidden rounded-2xl shadow-xl">
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