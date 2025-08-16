'use client'

import { useRouter } from 'next/navigation'
import { useCancellation } from '@/context/CancellationContext'
import { ModalHeader } from '../shared/ModalHeader'
import { Button } from '../shared/Button'

export function SuccessStep() {
    const router = useRouter()
    const { state } = useCancellation()

    return (
        <>
            <ModalHeader title="Cancellation Complete" />
            <div className="px-8 py-12 md:px-6 lg:px-10">
                <div className="text-center max-w-[500px] md:max-w-[450px] lg:max-w-[500px] mx-auto">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-[28px] md:text-[26px] lg:text-[28px] font-bold mb-3">
                        All done!
                    </h2>
                    <p className="text-[15px] md:text-[14px] lg:text-[15px] text-gray-600 mb-8 max-w-md mx-auto">
                        Your request has been processed successfully.
                        {state.hasFoundJob && " Wishing you all the best in your new role!"}
                    </p>
                    <Button onClick={() => router.push('/')} variant="primary">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        </>
    )
}