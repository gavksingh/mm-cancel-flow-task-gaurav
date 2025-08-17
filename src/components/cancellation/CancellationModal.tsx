'use client'

import { useEffect } from 'react'
import { useCancellation } from '@/context/CancellationContext'
import { useSubscription } from '@/hooks/useSubscription'
import { JobCheckStep } from './steps/JobCheckStep'
import { ReasonStep } from './steps/ReasonStep'
import { DownsellStep } from './steps/DownsellStep'
import { ConfirmStep } from './steps/ConfirmStep'
import { SuccessStep } from './steps/SuccessStep'
import { FeedbackStep } from './steps/FeedbackStep'
import { VisaStep } from './steps/VisaStep'
import { VisaAlternativeStep } from './steps/VisaAlternativeStep'
import { SuccessVisaHelpStep } from './steps/SuccessVisaHelpStep'
import { SuccessDownsellStep } from './steps/SuccessDownsellStep'
import { SurveyStep } from './steps/SurveyStep'
import { CancellationReasonStep } from './steps/CancellationReasonStep'

export function CancellationModal() {
    const { state } = useCancellation()
    const { fetchSubscriptionInfo } = useSubscription()

    useEffect(() => {
        fetchSubscriptionInfo()
    }, [])

    const renderStep = () => {
        // console.log('Current step:', state.step)
        switch (state.step) {
            case 'job-check':
                return <JobCheckStep />
            case 'reason':
                return <ReasonStep />
            case 'feedback':
                return <FeedbackStep />
            case 'visa':
                return <VisaStep />
            case 'visa-alternative':
                return <VisaAlternativeStep />
            case 'downsell':
                return <DownsellStep />
            case 'success-downsell':
                return <SuccessDownsellStep />
            case 'survey':
                return <SurveyStep />
            case 'cancellation-reason':
                return <CancellationReasonStep />
            case 'confirm':
                return <ConfirmStep />
            case 'success':
                return <SuccessStep />
            case 'success-visa-help':
                return <SuccessVisaHelpStep />
            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-[1100px] max-h-[90vh] overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {renderStep()}
                </div>
            </div>
        </div>
    )
}