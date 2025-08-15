import { useState, useEffect } from 'react'
import { getDeterministicVariant } from '@/lib/ab-test'
import { ABVariant } from '@/types/cancellation'
import { MOCK_USER_ID } from '@/utils/constants'

interface UseABTestReturn {
    variant: ABVariant
    isLoading: boolean
    assignVariant: (userId: string) => ABVariant
}

export function useABTest(userId: string = MOCK_USER_ID): UseABTestReturn {
    const [variant, setVariant] = useState<ABVariant>('A')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrAssignVariant = async () => {
            setIsLoading(true)

            try {
                // First, try to fetch existing variant from the database
                const response = await fetch(`/api/cancellation?userId=${userId}`)

                if (response.ok) {
                    const data = await response.json()
                    if (data.variant) {
                        setVariant(data.variant)
                        return
                    }
                }

                // If no existing variant, generate deterministically
                const newVariant = getDeterministicVariant(userId)
                setVariant(newVariant)
            } catch (error) {
                console.error('Error fetching variant:', error)
                // Fallback to deterministic generation
                const newVariant = getDeterministicVariant(userId)
                setVariant(newVariant)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrAssignVariant()
    }, [userId])

    const assignVariant = (newUserId: string): ABVariant => {
        const newVariant = getDeterministicVariant(newUserId)
        setVariant(newVariant)
        return newVariant
    }

    return {
        variant,
        isLoading,
        assignVariant
    }
}