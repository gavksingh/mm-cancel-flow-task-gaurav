// 'use client'

// import { createContext, useContext, useReducer, ReactNode } from 'react'
// import { CancellationFlowState, CancellationStep } from '@/types/cancellation'

// interface CancellationContextType {
//     state: CancellationFlowState
//     dispatch: React.Dispatch<CancellationAction>
// }

// type CancellationAction =
//     | { type: 'SET_STEP'; payload: CancellationStep }
//     | { type: 'SET_REASON'; payload: string }
//     | { type: 'SET_JOB_STATUS'; payload: boolean }
//     | { type: 'SET_VARIANT'; payload: 'A' | 'B' }
//     | { type: 'SET_LOADING'; payload: boolean }
//     | { type: 'SET_PRICE'; payload: number }
//     | { type: 'SET_ERROR'; payload: string | null }
//     | { type: 'SET_FIELD_ERROR'; payload: { field: string; message: string } }
//     | { type: 'CLEAR_FIELD_ERROR'; payload: string }
//     | { type: 'CLEAR_ALL_ERRORS' }

// const initialState: CancellationFlowState = {
//     step: 'job-check',
//     selectedReason: null,
//     hasFoundJob: null,
//     variant: 'A',
//     originalPrice: 2500,
//     isLoading: false,
//     error: null,
//     fieldErrors: {}
// }

// const cancellationReducer = (
//     state: CancellationFlowState,
//     action: CancellationAction
// ): CancellationFlowState => {
//     switch (action.type) {
//         case 'SET_STEP':
//             return { ...state, step: action.payload }
//         case 'SET_REASON':
//             return { ...state, selectedReason: action.payload }
//         case 'SET_JOB_STATUS':
//             return { ...state, hasFoundJob: action.payload }
//         case 'SET_VARIANT':
//             return { ...state, variant: action.payload }
//         case 'SET_LOADING':
//             return { ...state, isLoading: action.payload }
//         case 'SET_PRICE':
//             return { ...state, originalPrice: action.payload }
//         case 'SET_ERROR':
//             return { ...state, error: action.payload }
//         case 'SET_FIELD_ERROR':
//             return {
//                 ...state,
//                 fieldErrors: {
//                     ...state.fieldErrors,
//                     [action.payload.field]: action.payload.message
//                 }
//             }
//         case 'CLEAR_FIELD_ERROR':
//             // eslint-disable-next-line @typescript-eslint/no-unused-vars
//             const { [action.payload]: _, ...remainingFieldErrors } = state.fieldErrors
//             return { ...state, fieldErrors: remainingFieldErrors }
//         case 'CLEAR_ALL_ERRORS':
//             return { ...state, error: null, fieldErrors: {} }
//         default:
//             return state
//     }
// }

// const CancellationContext = createContext<CancellationContextType | undefined>(undefined)

// export function CancellationProvider({ children }: { children: ReactNode }) {
//     const [state, dispatch] = useReducer(cancellationReducer, initialState)

//     return (
//         <CancellationContext.Provider value={{ state, dispatch }}>
//             {children}
//         </CancellationContext.Provider>
//     )
// }

// export function useCancellation() {
//     const context = useContext(CancellationContext)
//     if (!context) {
//         throw new Error('useCancellation must be used within CancellationProvider')
//     }
//     return context
// }




'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CancellationFlowState, CancellationStep, ABVariant } from '@/types/cancellation'

interface CancellationContextType {
    state: CancellationFlowState
    dispatch: React.Dispatch<CancellationAction>
}

export type CancellationAction =
    | { type: 'SET_STEP'; payload: CancellationStep }
    | { type: 'SET_REASON'; payload: string | null }
    | { type: 'SET_JOB_STATUS'; payload: string }  // Changed from boolean to string
    | { type: 'SET_VARIANT'; payload: ABVariant }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_PRICE'; payload: number }
    | { type: 'SET_ACCEPTED_DOWNSELL'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_FIELD_ERROR'; payload: { field: string; message: string } }
    | { type: 'CLEAR_FIELD_ERROR'; payload: string }
    | { type: 'CLEAR_ALL_ERRORS' }
    | { type: 'RESET' }

const initialState: CancellationFlowState = {
    currentStep: 'job-check',
    selectedReason: null,
    jobStatus: null,  // Changed from hasFoundJob to jobStatus
    variant: 'A',
    originalPrice: 2500,
    acceptedDownsell: false,
    isLoading: false,
    error: null,
    fieldErrors: {}
}

const cancellationReducer = (
    state: CancellationFlowState,
    action: CancellationAction
): CancellationFlowState => {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, currentStep: action.payload }
        case 'SET_REASON':
            return { ...state, selectedReason: action.payload }
        case 'SET_JOB_STATUS':
            return { ...state, jobStatus: action.payload }  // Store as string
        case 'SET_VARIANT':
            return { ...state, variant: action.payload }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        case 'SET_PRICE':
            return { ...state, originalPrice: action.payload }
        case 'SET_ACCEPTED_DOWNSELL':
            return { ...state, acceptedDownsell: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        case 'SET_FIELD_ERROR':
            return {
                ...state,
                fieldErrors: {
                    ...state.fieldErrors,
                    [action.payload.field]: action.payload.message
                }
            }
        case 'CLEAR_FIELD_ERROR':
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [action.payload]: _, ...remainingFieldErrors } = state.fieldErrors
            return { ...state, fieldErrors: remainingFieldErrors }
        case 'CLEAR_ALL_ERRORS':
            return { ...state, error: null, fieldErrors: {} }
        case 'RESET':
            return initialState
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