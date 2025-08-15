import { useState, useCallback, useEffect } from 'react'

interface UseModalReturn {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

export function useModal(initialState = false): UseModalReturn {
    const [isOpen, setIsOpen] = useState(initialState)

    const open = useCallback(() => {
        setIsOpen(true)
    }, [])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [])

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                close()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, close])

    return {
        isOpen,
        open,
        close,
        toggle
    }
}