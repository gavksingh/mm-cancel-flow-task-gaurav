'use client'

import { useRouter } from 'next/navigation'

interface ModalHeaderProps {
    title: string
    onClose?: () => void
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
    const router = useRouter()

    const handleClose = () => {
        if (onClose) {
            onClose()
        } else {
            router.push('/')
        }
    }

    return (
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}