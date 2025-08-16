
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCancellation } from '@/context/CancellationContext'
import { ErrorText } from '../../shared/ErrorText'

interface Question {
    id: string
    text: string
    options: string[]
    value: string
    underlineWord?: string
    required?: boolean
}

export function ReasonStep() {
    const { state, dispatch } = useCancellation()

    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 'found_with_mm',
            text: 'Did you find this job with MigrateMate?',
            options: ['Yes', 'No'],
            value: '',
            required: true
        },
        {
            id: 'roles_applied',
            text: 'How many roles did you apply for through Migrate Mate?',
            options: ['0', '1 - 5', '6 - 20', '20+'],
            value: '',
            underlineWord: 'apply',
            required: true
        },
        {
            id: 'companies_emailed',
            text: 'How many companies did you email directly?',
            options: ['0', '1-5', '6-20', '20+'],
            value: '',
            underlineWord: 'email',
            required: true
        },
        {
            id: 'companies_interviewed',
            text: 'How many different companies did you interview with?',
            options: ['0', '1-2', '3-5', '5+'],
            value: '',
            underlineWord: 'interview',
            required: true
        }
    ])

    const handleOptionSelect = (questionId: string, option: string) => {
        // Clear field error when user selects an option
        dispatch({ type: 'CLEAR_FIELD_ERROR', payload: questionId })

        setQuestions(prev =>
            prev.map(q =>
                q.id === questionId ? { ...q, value: option } : q
            )
        )
    }

    const handleContinue = () => {
        // Validate all required questions are answered
        const unansweredQuestions = questions.filter(q => q.required && q.value === '')

        if (unansweredQuestions.length > 0) {
            // Set field errors for all unanswered questions
            unansweredQuestions.forEach(q => {
                dispatch({
                    type: 'SET_FIELD_ERROR',
                    payload: { field: q.id, message: 'This question is required' }
                })
            })

            // Focus the first unanswered question
            const firstUnansweredElement = document.querySelector(`[data-question-id="${unansweredQuestions[0].id}"]`)
            if (firstUnansweredElement) {
                firstUnansweredElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            return
        }

        // Clear all errors if validation passes
        dispatch({ type: 'CLEAR_ALL_ERRORS' })

        const responses = questions.map(q => ({
            question: q.text,
            answer: q.value
        }))

        dispatch({
            type: 'SET_REASON',
            payload: JSON.stringify({
                type: 'found_job',
                responses
            })
        })

        dispatch({ type: 'SET_STEP', payload: 'feedback' })
    }

    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 'job-check' })
    }

    const allQuestionsAnswered = questions.every(q => q.value !== '')

    const renderQuestionText = (text: string, underlineWord?: string, required?: boolean) => {
        const textWithAsterisk = text + (required ? '*' : '');

        if (!underlineWord) return textWithAsterisk;

        const parts = textWithAsterisk.split(' ');
        return parts.map((word, index) => {
            const cleanWord = word.replace('*', '');
            const hasAsterisk = word.includes('*');

            if (cleanWord.toLowerCase().includes(underlineWord.toLowerCase())) {
                return (
                    <span key={index}>
                        <u>{cleanWord}</u>{hasAsterisk && '*'}{' '}
                    </span>
                );
            }
            return <span key={index}>{word} </span>;
        });
    };

    return (
        <>
            {/* Mobile Layout - keeping as is */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <div>
                    <div className="px-6 py-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                {/* Title and Step indicator stacked */}
                                <h1 className="text-base font-semibold text-gray-900 whitespace-nowrap">
                                    Subscription Cancellation
                                </h1>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="flex space-x-1">
                                        <div className="w-6 h-1.5 bg-gray-400 rounded-full"></div>
                                        <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                                        <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <span className="text-xs text-gray-500">Step 1 of 3</span>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
                                className="text-gray-400 hover:text-gray-600 ml-4 cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Horizontal line */}
                    <div className="border-b border-gray-300"></div>

                    {/* Back button below line */}
                    <div className="px-4 py-2">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-medium">Back</span>
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {/* Title with inline emoji */}
                    <h2 className="text-[26px] leading-tight font-bold text-gray-900 whitespace-nowrap mb-2">
                        Congrats on the new role! 🎉
                    </h2>

                    {/* Horizontal line after title */}
                    <div className="w-full border-t border-gray-200 mb-6"></div>

                    {/* Questions */}
                    <div className="space-y-7">
                        {questions.map((question) => (
                            <div key={question.id} data-question-id={question.id} className={`transition-colors ${state.fieldErrors[question.id] ? 'p-3 border border-red-500 rounded-lg bg-red-50' : ''
                                }`}>
                                <p className="text-[15px] text-gray-700 mb-4">
                                    {renderQuestionText(question.text, question.underlineWord, question.required)}
                                </p>

                                <div className={`grid ${question.options.length === 2 ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                                    {question.options.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionSelect(question.id, option)}
                                            className={`py-2.5 px-3 rounded-lg border-2 transition-all text-sm font-medium cursor-pointer ${question.value === option
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <ErrorText message={state.fieldErrors[question.id] || ''} />
                            </div>
                        ))}
                    </div>

                    {/* Horizontal line before continue */}
                    <div className="w-full border-t border-gray-200 mt-8 mb-6"></div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all cursor-pointer ${allQuestionsAnswered
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* Desktop Layout - FIXED */}
            <div className="hidden lg:block">
                {/* Desktop Header */}
                <div className="px-8 py-3 border-b border-gray-100 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
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
                                <div className="w-8 h-2 bg-gray-400 rounded-full"></div>
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Step 1 of 3</span>
                        </div>
                    </div>

                    <button
                        onClick={() => dispatch({ type: 'SET_STEP', payload: 'job-check' })}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex p-8 md:p-6 lg:p-10">
                    {/* Left Side - Questions */}
                    <div className="flex-1 pr-10 md:pr-8 lg:pr-10">
                        {/* Title with emoji inline */}
                        <h2 className="text-[38px] md:text-[34px] lg:text-[38px] leading-tight font-bold text-gray-900 mb-8 whitespace-nowrap">
                            Congrats on the new role! 🎉
                        </h2>

                        {/* Set max width for all content to align */}
                        <div className="max-w-[460px] md:max-w-[420px] lg:max-w-[460px]">
                            <div className="space-y-7">
                                {/* First question with full-width Yes/No buttons */}
                                <div data-question-id={questions[0].id} className={`transition-colors ${state.fieldErrors[questions[0].id] ? 'p-3 border border-red-500 rounded-lg bg-red-50' : ''
                                    }`}>
                                    <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-4">
                                        {renderQuestionText(questions[0].text, questions[0].underlineWord, questions[0].required)}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        {questions[0].options.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => handleOptionSelect(questions[0].id, option)}
                                                className={`py-2.5 px-5 rounded-lg border-2 transition-all text-[15px] md:text-[14px] lg:text-[15px] font-medium cursor-pointer ${questions[0].value === option
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    <ErrorText message={state.fieldErrors[questions[0].id] || ''} />
                                </div>

                                {/* Other questions with 4-column grid */}
                                {questions.slice(1).map((question) => (
                                    <div key={question.id} data-question-id={question.id} className={`transition-colors ${state.fieldErrors[question.id] ? 'p-3 border border-red-500 rounded-lg bg-red-50' : ''
                                        }`}>
                                        <p className="text-[16px] md:text-[15px] lg:text-[16px] text-gray-700 mb-4">
                                            {renderQuestionText(question.text, question.underlineWord, question.required)}
                                        </p>

                                        <div className="grid grid-cols-4 gap-3 md:gap-2 lg:gap-3">
                                            {question.options.map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleOptionSelect(question.id, option)}
                                                    className={`py-2.5 px-3 md:px-2 lg:px-3 rounded-lg border-2 transition-all text-[15px] md:text-[14px] lg:text-[15px] font-medium cursor-pointer ${question.value === option
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>

                                        <ErrorText message={state.fieldErrors[question.id] || ''} />
                                    </div>
                                ))}
                            </div>

                            {/* Horizontal line - normal spacing without spacer */}
                            <div className="w-full border-t border-gray-200 mt-10 mb-6"></div>

                            {/* Continue Button - same width as container */}
                            <button
                                onClick={handleContinue}
                                className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all cursor-pointer ${allQuestionsAnswered
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Image with dynamic height matching content */}
                    <div className="ml-2">
                        <div className="relative w-[480px] h-full md:w-[400px] lg:w-[480px] overflow-hidden rounded-2xl shadow-xl">
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