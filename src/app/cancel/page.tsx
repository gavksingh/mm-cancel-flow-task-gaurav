'use client'

import { CancellationModal } from '@/components/cancellation'
import { CancellationProvider } from '@/context/CancellationContext'

export default function CancelPage() {
    return (
        <CancellationProvider>
            <CancellationModal />
        </CancellationProvider>
    )
}