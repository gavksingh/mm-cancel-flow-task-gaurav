// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import { useCancellation } from '@/context/CancellationContext'
// import { useCancellationFlow } from '@/hooks/useCancellationFlow'

// export function CancellationReasonStep() {
//     const { state, dispatch } = useCancellation()
//     const { submitCancellation, isSubmitting } = useCancellationFlow()
//     const [isProcessing, setIsProcessing] = useState(false)
//     const [selectedReason, setSelectedReason] = useState<string | null>(null)
//     const [showError, setShowError] = useState(false)
//     const [feedbackText, setFeedbackText] = useState('')
//     const [priceInput, setPriceInput] = useState('')
//     const [attemptedContinue, setAttemptedContinue] = useState(false)

//     // Calculate the discounted price
//     const discountedPrice = (state.originalPrice / 200).toFixed(2) // 50% off
//     const originalPrice = (state.originalPrice / 100).toFixed(0)

//     const handleGetOffer = async () => {
//         setIsProcessing(true)
//         try {
//             // Store reason data
//             const reasonData = {
//                 reason: selectedReason,
//                 feedback: feedbackText,
//                 maxPrice: priceInput,
//                 acceptedAfterReason: true
//             }

//             await submitCancellation(
//                 JSON.stringify(reasonData),
//                 true, // accepting downsell
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

//     const handleCompleteCancellation = async () => {
//         // Check if reason is selected
//         if (!selectedReason) {
//             setShowError(true)
//             return
//         }

//         // Check if additional input is required and validate
//         if (selectedReason === 'Too expensive' && !priceInput) {
//             setAttemptedContinue(true)
//             return
//         }

//         if ((selectedReason === 'Platform not helpful' ||
//             selectedReason === 'Not enough relevant jobs' ||
//             selectedReason === 'Decided not to move') &&
//             feedbackText.length < 25) {
//             setAttemptedContinue(true)
//             return
//         }

//         setIsProcessing(true)
//         try {
//             // Store reason data
//             const reasonData = {
//                 reason: selectedReason,
//                 feedback: feedbackText,
//                 maxPrice: priceInput,
//                 acceptedAfterReason: false
//             }

//             await submitCancellation(
//                 JSON.stringify(reasonData),
//                 false, // declining downsell
//                 state.variant
//             )

//             // Go to confirm step
//             dispatch({ type: 'SET_STEP', payload: 'confirm' })
//         } catch (error) {
//             console.error('Error completing cancellation:', error)
//             alert('There was an error processing your request. Please try again.')
//         } finally {
//             setIsProcessing(false)
//         }
//     }

//     const handleBack = () => {
//         dispatch({ type: 'SET_STEP', payload: 'survey' })
//     }

//     const handleReasonSelect = (reason: string) => {
//         setSelectedReason(reason)
//         setShowError(false)
//         setAttemptedContinue(false)
//         // Reset inputs when changing reason
//         if (reason !== selectedReason) {
//             setFeedbackText('')
//             setPriceInput('')
//         }
//     }

//     // Custom Radio Button Component
//     const RadioButton = ({ value, label }: { value: string, label: string }) => (
//         <label
//             className="flex items-center cursor-pointer"
//             onClick={() => handleReasonSelect(value)}
//         >
//             <div className="relative">
//                 <div className={`w-5 h-5 rounded-full border-2 transition-colors ${selectedReason === value
//                     ? 'border-gray-900 bg-gray-900'
//                     : 'border-gray-300'
//                     }`}>
//                     {selectedReason === value && (
//                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
//                     )}
//                 </div>
//             </div>
//             <span className="ml-3 text-gray-700 select-none">{label}</span>
//         </label>
//     )

//     // Check if form is ready to submit
//     const isFormValid = selectedReason && (
//         selectedReason === 'Other' ||
//         (selectedReason === 'Too expensive' && priceInput) ||
//         ((selectedReason === 'Platform not helpful' ||
//             selectedReason === 'Not enough relevant jobs' ||
//             selectedReason === 'Decided not to move') && feedbackText.length >= 25)
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
//                     <h2 className="text-[24px] leading-tight font-bold text-gray-650 mb-2">
//                         What's the main reason for cancelling?
//                     </h2>
//                     <p className="text-[14px] text-gray-600 mb-4">
//                         Please take a minute to let us know why:
//                     </p>

//                     {/* Horizontal line */}
//                     <div className="w-full border-t border-gray-200 mb-4"></div>

//                     {showError && (
//                         <p className="text-[14px] text-red-600 mb-4">
//                             To help us understand your experience, please select a reason for cancelling*
//                         </p>
//                     )}

//                     {/* Radio Options - show only selected one or all if none selected */}
//                     <div className="space-y-3 mb-6">
//                         {['Too expensive', 'Platform not helpful', 'Not enough relevant jobs', 'Decided not to move', 'Other'].map((reason) => (
//                             (!selectedReason || selectedReason === reason) && (
//                                 <RadioButton key={reason} value={reason} label={reason} />
//                             )
//                         ))}
//                     </div>

//                     {/* Conditional inputs based on selection */}
//                     {selectedReason === 'Too expensive' && (
//                         <div className="mb-6">
//                             <p className="text-[14px] text-gray-700 mb-3">
//                                 What would be the maximum you would be willing to pay?*
//                             </p>
//                             {attemptedContinue && !priceInput && (
//                                 <p className="text-[13px] text-red-600 mb-2">
//                                     Please enter a price so we can understand your feedback*
//                                 </p>
//                             )}
//                             <div className="relative">
//                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//                                 <input
//                                     type="text"
//                                     value={priceInput}
//                                     onChange={(e) => setPriceInput(e.target.value)}
//                                     className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {selectedReason === 'Platform not helpful' && (
//                         <div className="mb-6">
//                             <p className="text-[14px] text-gray-700 mb-3">
//                                 What can we change to make the platform more helpful?*
//                             </p>
//                             {attemptedContinue && feedbackText.length < 25 && (
//                                 <p className="text-[13px] text-red-600 mb-2">
//                                     Please enter at least 25 characters so we can understand your feedback*
//                                 </p>
//                             )}
//                             <div className="relative">
//                                 <textarea
//                                     value={feedbackText}
//                                     onChange={(e) => setFeedbackText(e.target.value)}
//                                     placeholder=""
//                                     className="w-full px-3 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-32 resize-none"
//                                 />
//                                 <p className={`absolute bottom-2 right-3 text-xs ${attemptedContinue && feedbackText.length < 25
//                                     ? 'text-red-600'
//                                     : feedbackText.length >= 25
//                                         ? 'text-green-600'
//                                         : 'text-gray-500'
//                                     }`}>
//                                     Min 25 characters ({feedbackText.length}/25)
//                                 </p>
//                             </div>
//                         </div>
//                     )}

//                     {selectedReason === 'Not enough relevant jobs' && (
//                         <div className="mb-6">
//                             <p className="text-[14px] text-gray-700 mb-3">
//                                 In which way can we make the jobs more relevant?*
//                             </p>
//                             {attemptedContinue && feedbackText.length < 25 && (
//                                 <p className="text-[13px] text-red-600 mb-2">
//                                     Please enter at least 25 characters so we can understand your feedback*
//                                 </p>
//                             )}
//                             <div className="relative">
//                                 <textarea
//                                     value={feedbackText}
//                                     onChange={(e) => setFeedbackText(e.target.value)}
//                                     placeholder=""
//                                     className="w-full px-3 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-32 resize-none"
//                                 />
//                                 <p className={`absolute bottom-2 right-3 text-xs ${attemptedContinue && feedbackText.length < 25
//                                     ? 'text-red-600'
//                                     : feedbackText.length >= 25
//                                         ? 'text-green-600'
//                                         : 'text-gray-500'
//                                     }`}>
//                                     Min 25 characters ({feedbackText.length}/25)
//                                 </p>
//                             </div>
//                         </div>
//                     )}

//                     {selectedReason === 'Decided not to move' && (
//                         <div className="mb-6">
//                             <p className="text-[14px] text-gray-700 mb-3">
//                                 What changed for you to decide to not move?*
//                             </p>
//                             {attemptedContinue && feedbackText.length < 25 && (
//                                 <p className="text-[13px] text-red-600 mb-2">
//                                     Please enter at least 25 characters so we can understand your feedback*
//                                 </p>
//                             )}
//                             <div className="relative">
//                                 <textarea
//                                     value={feedbackText}
//                                     onChange={(e) => setFeedbackText(e.target.value)}
//                                     placeholder=""
//                                     className="w-full px-3 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-32 resize-none"
//                                 />
//                                 <p className={`absolute bottom-2 right-3 text-xs ${attemptedContinue && feedbackText.length < 25
//                                     ? 'text-red-600'
//                                     : feedbackText.length >= 25
//                                         ? 'text-green-600'
//                                         : 'text-gray-500'
//                                     }`}>
//                                     Min 25 characters ({feedbackText.length}/25)
//                                 </p>
//                             </div>
//                         </div>
//                     )}

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
//                         onClick={handleCompleteCancellation}
//                         disabled={isProcessing || isSubmitting}
//                         className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${isFormValid
//                             ? 'bg-red-600 text-white hover:bg-red-700'
//                             : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//                             }`}
//                     >
//                         Complete cancellation
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
//                     {/* Left Side - Content with flex column */}
//                     <div className="flex-1 pr-8 max-w-[600px] md:max-w-[500px] lg:max-w-[600px] flex flex-col">
//                         <h2 className="text-[32px] md:text-[30px] lg:text-[32px] leading-tight font-bold text-gray-900 mb-2">
//                             What's the main reason for cancelling?
//                         </h2>
//                         <p className="text-[16px] text-gray-600 mb-6">
//                             Please take a minute to let us know why:
//                         </p>

//                         {showError && (
//                             <p className="text-[15px] text-red-600 mb-4">
//                                 To help us understand your experience, please select a reason for cancelling*
//                             </p>
//                         )}

//                         {/* Radio Options - show only selected one or all if none selected */}
//                         <div className="space-y-4 mb-6">
//                             {['Too expensive', 'Platform not helpful', 'Not enough relevant jobs', 'Decided not to move', 'Other'].map((reason) => (
//                                 (!selectedReason || selectedReason === reason) && (
//                                     <RadioButton key={reason} value={reason} label={reason} />
//                                 )
//                             ))}
//                         </div>

//                         {/* Conditional inputs based on selection */}
//                         {selectedReason === 'Too expensive' && (
//                             <div className="mb-6">
//                                 <p className="text-[16px] text-gray-700 mb-3">
//                                     What would be the maximum you would be willing to pay?*
//                                 </p>
//                                 {attemptedContinue && !priceInput && (
//                                     <p className="text-[14px] text-red-600 mb-2">
//                                         Please enter a price so we can understand your feedback*
//                                     </p>
//                                 )}
//                                 <div className="relative">
//                                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//                                     <input
//                                         type="text"
//                                         value={priceInput}
//                                         onChange={(e) => setPriceInput(e.target.value)}
//                                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-[16px]"
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {selectedReason === 'Platform not helpful' && (
//                             <div className="mb-6">
//                                 <p className="text-[16px] text-gray-700 mb-3">
//                                     What can we change to make the platform more helpful?*
//                                 </p>
//                                 {attemptedContinue && feedbackText.length < 25 && (
//                                     <p className="text-[14px] text-red-600 mb-2">
//                                         Please enter at least 25 characters so we can understand your feedback*
//                                     </p>
//                                 )}
//                                 <div className="relative">
//                                     <textarea
//                                         value={feedbackText}
//                                         onChange={(e) => setFeedbackText(e.target.value)}
//                                         placeholder=""
//                                         className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-36 resize-none text-[16px]"
//                                     />
//                                     <p className={`absolute bottom-2 right-3 text-sm ${attemptedContinue && feedbackText.length < 25
//                                         ? 'text-red-600'
//                                         : feedbackText.length >= 25
//                                             ? 'text-green-600'
//                                             : 'text-gray-500'
//                                         }`}>
//                                         Min 25 characters ({feedbackText.length}/25)
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                         {selectedReason === 'Not enough relevant jobs' && (
//                             <div className="mb-6">
//                                 <p className="text-[16px] text-gray-700 mb-3">
//                                     In which way can we make the jobs more relevant?*
//                                 </p>
//                                 {attemptedContinue && feedbackText.length < 25 && (
//                                     <p className="text-[14px] text-red-600 mb-2">
//                                         Please enter at least 25 characters so we can understand your feedback*
//                                     </p>
//                                 )}
//                                 <div className="relative">
//                                     <textarea
//                                         value={feedbackText}
//                                         onChange={(e) => setFeedbackText(e.target.value)}
//                                         placeholder=""
//                                         className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-36 resize-none text-[16px]"
//                                     />
//                                     <p className={`absolute bottom-2 right-3 text-sm ${attemptedContinue && feedbackText.length < 25
//                                         ? 'text-red-600'
//                                         : feedbackText.length >= 25
//                                             ? 'text-green-600'
//                                             : 'text-gray-500'
//                                         }`}>
//                                         Min 25 characters ({feedbackText.length}/25)
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                         {selectedReason === 'Decided not to move' && (
//                             <div className="mb-6">
//                                 <p className="text-[16px] text-gray-700 mb-3">
//                                     What changed for you to decide to not move?*
//                                 </p>
//                                 {attemptedContinue && feedbackText.length < 25 && (
//                                     <p className="text-[14px] text-red-600 mb-2">
//                                         Please enter at least 25 characters so we can understand your feedback*
//                                     </p>
//                                 )}
//                                 <div className="relative">
//                                     <textarea
//                                         value={feedbackText}
//                                         onChange={(e) => setFeedbackText(e.target.value)}
//                                         placeholder=""
//                                         className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-36 resize-none text-[16px]"
//                                     />
//                                     <p className={`absolute bottom-2 right-3 text-sm ${attemptedContinue && feedbackText.length < 25
//                                         ? 'text-red-600'
//                                         : feedbackText.length >= 25
//                                             ? 'text-green-600'
//                                             : 'text-gray-500'
//                                         }`}>
//                                         Min 25 characters ({feedbackText.length}/25)
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Horizontal line */}
//                         <div className="w-full border-t border-gray-300 mb-5"></div>

//                         {/* Spacer to push buttons to bottom */}
//                         <div className="flex-grow"></div>

//                         {/* Buttons */}
//                         <div>
//                             <button
//                                 onClick={handleGetOffer}
//                                 disabled={isProcessing || isSubmitting}
//                                 className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer mb-3"
//                             >
//                                 Get 50% off | ${discountedPrice} <span className="line-through text-green-200">${originalPrice}</span>
//                             </button>

//                             <button
//                                 onClick={handleCompleteCancellation}
//                                 disabled={isProcessing || isSubmitting}
//                                 className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${isFormValid
//                                     ? 'bg-red-600 text-white hover:bg-red-700'
//                                     : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//                                     }`}
//                             >
//                                 Complete cancellation
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

// Define interface for parsed data
interface ParsedReasonData {
    jobStatus?: string
    survey?: any
    reason?: string
    feedback?: string
    maxPrice?: string
    acceptedAfterReason?: boolean
}

export function CancellationReasonStep() {
    const { state, dispatch } = useCancellation()
    const { submitCancellation, isSubmitting } = useCancellationFlow()
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedReason, setSelectedReason] = useState<string | null>(null)
    const [showError, setShowError] = useState(false)
    const [feedbackText, setFeedbackText] = useState('')
    const [priceInput, setPriceInput] = useState('')
    const [attemptedContinue, setAttemptedContinue] = useState(false)

    // Calculate the discounted price
    const discountedPrice = (state.originalPrice / 200).toFixed(2) // 50% off
    const originalPrice = (state.originalPrice / 100).toFixed(0)

    const handleGetOffer = async () => {
        setIsProcessing(true)
        try {
            // Parse existing data (including survey data)
            let existingData: ParsedReasonData = {}
            try {
                if (state.selectedReason) {
                    existingData = JSON.parse(state.selectedReason)
                }
            } catch (e) {
                existingData = {}
            }

            // Store reason data with survey
            const reasonData = {
                ...existingData,
                reason: selectedReason,
                feedback: feedbackText,
                maxPrice: priceInput,
                jobStatus: state.jobStatus || existingData.jobStatus || 'Still job searching',
                acceptedAfterReason: true
            }

            await submitCancellation(
                JSON.stringify(reasonData),
                true, // accepting downsell
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

    const handleCompleteCancellation = async () => {
        // Check if reason is selected
        if (!selectedReason) {
            setShowError(true)
            return
        }

        // Check if additional input is required and validate
        if (selectedReason === 'Too expensive' && !priceInput) {
            setAttemptedContinue(true)
            return
        }

        if ((selectedReason === 'Platform not helpful' ||
            selectedReason === 'Not enough relevant jobs' ||
            selectedReason === 'Decided not to move') &&
            feedbackText.length < 25) {
            setAttemptedContinue(true)
            return
        }

        setIsProcessing(true)
        try {
            // Parse existing data (including survey data)
            let existingData: ParsedReasonData = {}
            try {
                if (state.selectedReason) {
                    existingData = JSON.parse(state.selectedReason)
                }
            } catch (e) {
                existingData = {}
            }

            // Store reason data with survey
            const reasonData = {
                ...existingData,
                reason: selectedReason,
                feedback: feedbackText,
                maxPrice: priceInput,
                jobStatus: state.jobStatus || existingData.jobStatus || 'Still job searching',
                acceptedAfterReason: false
            }

            await submitCancellation(
                JSON.stringify(reasonData),
                false, // declining downsell
                state.variant
            )

            // Go to confirm step
            dispatch({ type: 'SET_STEP', payload: 'confirm' })
        } catch (error) {
            console.error('Error completing cancellation:', error)
            alert('There was an error processing your request. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'survey' })
    }

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason)
        setShowError(false)
        setAttemptedContinue(false)
        // Reset inputs when changing reason
        if (reason !== selectedReason) {
            setFeedbackText('')
            setPriceInput('')
        }
    }

    // Custom Radio Button Component
    const RadioButton = ({ value, label }: { value: string, label: string }) => (
        <label
            className="flex items-center cursor-pointer"
            onClick={() => handleReasonSelect(value)}
        >
            <div className="relative">
                <div className={`w-5 h-5 rounded-full border-2 transition-colors ${selectedReason === value
                    ? 'border-gray-900 bg-gray-900'
                    : 'border-gray-300'
                    }`}>
                    {selectedReason === value && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                    )}
                </div>
            </div>
            <span className="ml-3 text-gray-700 select-none">{label}</span>
        </label>
    )

    // Check if form is ready to submit
    const isFormValid = selectedReason && (
        selectedReason === 'Other' ||
        (selectedReason === 'Too expensive' && priceInput) ||
        ((selectedReason === 'Platform not helpful' ||
            selectedReason === 'Not enough relevant jobs' ||
            selectedReason === 'Decided not to move') && feedbackText.length >= 25)
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
                    <h2 className="text-[24px] leading-tight font-bold text-gray-650 mb-2">
                        What's the main reason for cancelling?
                    </h2>
                    <p className="text-[14px] text-gray-600 mb-4">
                        Please take a minute to let us know why:
                    </p>

                    {/* Horizontal line */}
                    <div className="w-full border-t border-gray-200 mb-4"></div>

                    {showError && (
                        <p className="text-[14px] text-red-600 mb-4">
                            To help us understand your experience, please select a reason for cancelling*
                        </p>
                    )}

                    {/* Radio Options - show only selected one or all if none selected */}
                    <div className="space-y-3 mb-6">
                        {['Too expensive', 'Platform not helpful', 'Not enough relevant jobs', 'Decided not to move', 'Other'].map((reason) => (
                            (!selectedReason || selectedReason === reason) && (
                                <RadioButton key={reason} value={reason} label={reason} />
                            )
                        ))}
                    </div>

                    {/* Conditional inputs based on selection */}
                    {selectedReason === 'Too expensive' && (
                        <div className="mb-6">
                            <p className="text-[14px] text-gray-700 mb-3">
                                What would be the maximum you would be willing to pay?*
                            </p>
                            {attemptedContinue && !priceInput && (
                                <p className="text-[13px] text-red-600 mb-2">
                                    Please enter a price so we can understand your feedback*
                                </p>
                            )}
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="text"
                                    value={priceInput}
                                    onChange={(e) => setPriceInput(e.target.value)}
                                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                />
                            </div>
                        </div>
                    )}

                    {selectedReason === 'Platform not helpful' && (
                        <div className="mb-6">
                            <p className="text-[14px] text-gray-700 mb-3">
                                What can we change to make the platform more helpful?*
                            </p>
                            {attemptedContinue && feedbackText.length < 25 && (
                                <p className="text-[13px] text-red-600 mb-2">
                                    Please enter at least 25 characters so we can understand your feedback*
                                </p>
                            )}
                            <div className="relative">
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder=""
                                    className="w-full px-3 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-32 resize-none"
                                />
                                <p className={`absolute bottom-2 right-3 text-xs ${attemptedContinue && feedbackText.length < 25
                                    ? 'text-red-600'
                                    : feedbackText.length >= 25
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                    }`}>
                                    Min 25 characters ({feedbackText.length}/25)
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedReason === 'Not enough relevant jobs' && (
                        <div className="mb-6">
                            <p className="text-[14px] text-gray-700 mb-3">
                                In which way can we make the jobs more relevant?*
                            </p>
                            {attemptedContinue && feedbackText.length < 25 && (
                                <p className="text-[13px] text-red-600 mb-2">
                                    Please enter at least 25 characters so we can understand your feedback*
                                </p>
                            )}
                            <div className="relative">
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder=""
                                    className="w-full px-3 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-32 resize-none"
                                />
                                <p className={`absolute bottom-2 right-3 text-xs ${attemptedContinue && feedbackText.length < 25
                                    ? 'text-red-600'
                                    : feedbackText.length >= 25
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                    }`}>
                                    Min 25 characters ({feedbackText.length}/25)
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedReason === 'Decided not to move' && (
                        <div className="mb-6">
                            <p className="text-[14px] text-gray-700 mb-3">
                                What changed for you to decide to not move?*
                            </p>
                            {attemptedContinue && feedbackText.length < 25 && (
                                <p className="text-[13px] text-red-600 mb-2">
                                    Please enter at least 25 characters so we can understand your feedback*
                                </p>
                            )}
                            <div className="relative">
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder=""
                                    className="w-full px-3 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-32 resize-none"
                                />
                                <p className={`absolute bottom-2 right-3 text-xs ${attemptedContinue && feedbackText.length < 25
                                    ? 'text-red-600'
                                    : feedbackText.length >= 25
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                    }`}>
                                    Min 25 characters ({feedbackText.length}/25)
                                </p>
                            </div>
                        </div>
                    )}

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
                        onClick={handleCompleteCancellation}
                        disabled={isProcessing || isSubmitting}
                        className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${isFormValid
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Complete cancellation
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
                    {/* Left Side - Content with flex column */}
                    <div className="flex-1 pr-8 max-w-[600px] md:max-w-[500px] lg:max-w-[600px] flex flex-col">
                        <h2 className="text-[32px] md:text-[30px] lg:text-[32px] leading-tight font-bold text-gray-900 mb-2">
                            What's the main reason for cancelling?
                        </h2>
                        <p className="text-[16px] text-gray-600 mb-6">
                            Please take a minute to let us know why:
                        </p>

                        {showError && (
                            <p className="text-[15px] text-red-600 mb-4">
                                To help us understand your experience, please select a reason for cancelling*
                            </p>
                        )}

                        {/* Radio Options - show only selected one or all if none selected */}
                        <div className="space-y-4 mb-6">
                            {['Too expensive', 'Platform not helpful', 'Not enough relevant jobs', 'Decided not to move', 'Other'].map((reason) => (
                                (!selectedReason || selectedReason === reason) && (
                                    <RadioButton key={reason} value={reason} label={reason} />
                                )
                            ))}
                        </div>

                        {/* Conditional inputs based on selection */}
                        {selectedReason === 'Too expensive' && (
                            <div className="mb-6">
                                <p className="text-[16px] text-gray-700 mb-3">
                                    What would be the maximum you would be willing to pay?*
                                </p>
                                {attemptedContinue && !priceInput && (
                                    <p className="text-[14px] text-red-600 mb-2">
                                        Please enter a price so we can understand your feedback*
                                    </p>
                                )}
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="text"
                                        value={priceInput}
                                        onChange={(e) => setPriceInput(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-[16px]"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedReason === 'Platform not helpful' && (
                            <div className="mb-6">
                                <p className="text-[16px] text-gray-700 mb-3">
                                    What can we change to make the platform more helpful?*
                                </p>
                                {attemptedContinue && feedbackText.length < 25 && (
                                    <p className="text-[14px] text-red-600 mb-2">
                                        Please enter at least 25 characters so we can understand your feedback*
                                    </p>
                                )}
                                <div className="relative">
                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder=""
                                        className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-36 resize-none text-[16px]"
                                    />
                                    <p className={`absolute bottom-2 right-3 text-sm ${attemptedContinue && feedbackText.length < 25
                                        ? 'text-red-600'
                                        : feedbackText.length >= 25
                                            ? 'text-green-600'
                                            : 'text-gray-500'
                                        }`}>
                                        Min 25 characters ({feedbackText.length}/25)
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedReason === 'Not enough relevant jobs' && (
                            <div className="mb-6">
                                <p className="text-[16px] text-gray-700 mb-3">
                                    In which way can we make the jobs more relevant?*
                                </p>
                                {attemptedContinue && feedbackText.length < 25 && (
                                    <p className="text-[14px] text-red-600 mb-2">
                                        Please enter at least 25 characters so we can understand your feedback*
                                    </p>
                                )}
                                <div className="relative">
                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder=""
                                        className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-36 resize-none text-[16px]"
                                    />
                                    <p className={`absolute bottom-2 right-3 text-sm ${attemptedContinue && feedbackText.length < 25
                                        ? 'text-red-600'
                                        : feedbackText.length >= 25
                                            ? 'text-green-600'
                                            : 'text-gray-500'
                                        }`}>
                                        Min 25 characters ({feedbackText.length}/25)
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedReason === 'Decided not to move' && (
                            <div className="mb-6">
                                <p className="text-[16px] text-gray-700 mb-3">
                                    What changed for you to decide to not move?*
                                </p>
                                {attemptedContinue && feedbackText.length < 25 && (
                                    <p className="text-[14px] text-red-600 mb-2">
                                        Please enter at least 25 characters so we can understand your feedback*
                                    </p>
                                )}
                                <div className="relative">
                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder=""
                                        className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 h-36 resize-none text-[16px]"
                                    />
                                    <p className={`absolute bottom-2 right-3 text-sm ${attemptedContinue && feedbackText.length < 25
                                        ? 'text-red-600'
                                        : feedbackText.length >= 25
                                            ? 'text-green-600'
                                            : 'text-gray-500'
                                        }`}>
                                        Min 25 characters ({feedbackText.length}/25)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Horizontal line */}
                        <div className="w-full border-t border-gray-300 mb-5"></div>

                        {/* Spacer to push buttons to bottom */}
                        <div className="flex-grow"></div>

                        {/* Buttons */}
                        <div>
                            <button
                                onClick={handleGetOffer}
                                disabled={isProcessing || isSubmitting}
                                className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer mb-3"
                            >
                                Get 50% off | ${discountedPrice} <span className="line-through text-green-200">${originalPrice}</span>
                            </button>

                            <button
                                onClick={handleCompleteCancellation}
                                disabled={isProcessing || isSubmitting}
                                className={`w-full py-3.5 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${isFormValid
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                Complete cancellation
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