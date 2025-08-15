'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CancellationFlowState, CancellationStep } from '@/types/cancellation'

interface CancellationContextType {
    state: CancellationFlowState
    dispatch: React.Dispatch<CancellationAction>
}

type CancellationAction =
    | { type: 'SET_STEP'; payload: CancellationStep }
    | { type: 'SET_REASON'; payload: string }
    | { type: 'SET_JOB_STATUS'; payload: boolean }
    | { type: 'SET_VARIANT'; payload: 'A' | 'B' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_PRICE'; payload: number }

const initialState: CancellationFlowState = {
    step: 'job-check',
    selectedReason: null,
    hasFoundJob: null,
    variant: 'A',
    originalPrice: 2500,
    isLoading: false
}

const cancellationReducer = (
    state: CancellationFlowState,
    action: CancellationAction
): CancellationFlowState => {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload }
        case 'SET_REASON':
            return { ...state, selectedReason: action.payload }
        case 'SET_JOB_STATUS':
            return { ...state, hasFoundJob: action.payload }
        case 'SET_VARIANT':
            return { ...state, variant: action.payload }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        case 'SET_PRICE':
            return { ...state, originalPrice: action.payload }
        default:
            return state
    }
}

const CancellationContext = createContext<CancellationContextType | undefined>(undefined)

export function CancellationProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cancellationReducer, initialState)

    return (
        <CancellationContext.Provider value={{ state, dispatch }}>
            {children}
        </CancellationContext.Provider>
    )
}

export function useCancellation() {
    const context = useContext(CancellationContext)
    if (!context) {
        throw new Error('useCancellation must be used within CancellationProvider')
    }
    return context
}