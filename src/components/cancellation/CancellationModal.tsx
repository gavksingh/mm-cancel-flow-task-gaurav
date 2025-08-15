'use client'

import { useEffect } from 'react'
import { useCancellation } from '@/context/CancellationContext'
import { useSubscription } from '@/hooks/useSubscription'
import { JobCheckStep } from './steps/JobCheckStep'
import { ReasonStep } from './steps/ReasonStep'
import { DownsellStep } from './steps/DownsellStep'
import { ConfirmStep } from './steps/ConfirmStep'
import { SuccessStep } from './steps/SuccessStep'

export function CancellationModal() {
    const { state } = useCancellation()
    const { fetchSubscriptionInfo } = useSubscription()

    useEffect(() => {
        fetchSubscriptionInfo()
    }, [])

    const renderStep = () => {
        switch (state.step) {
            case 'job-check':
                return <JobCheckStep />
            case 'reason':
                return <ReasonStep />
            case 'downsell':
                return <DownsellStep />
            case 'confirm':
                return <ConfirmStep />
            case 'success':
                return <SuccessStep />
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