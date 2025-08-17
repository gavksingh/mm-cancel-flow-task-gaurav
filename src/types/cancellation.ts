// export type CancellationStep =
//     | 'job-check'
//     | 'reason'
//     | 'feedback'
//     | 'visa'
//     | 'visa-alternative'
//     | 'downsell'
//     | 'survey'
//     | 'cancellation-reason'
//     | 'success'
//     | 'success-visa-help'
//     | 'success-downsell'
//     | 'confirm'

// export type ABVariant = 'A' | 'B'

// export interface CancellationReason {
//     id: string
//     label: string
//     value: string
// }

// export interface CancellationFlowState {
//     step: CancellationStep
//     selectedReason: string | null
//     hasFoundJob: boolean | null
//     variant: ABVariant
//     originalPrice: number
//     isLoading: boolean
//     error: string | null
//     fieldErrors: Record<string, string>
// }

// export interface JobFoundResponses {
//     type: 'found_job' | 'still_searching' | 'other'
//     responses?: Array<{
//         question: string
//         answer: string
//     }>
// }

// export interface CancellationData {
//     userId: string
//     subscriptionId: string
//     downsellVariant: ABVariant
//     reason: string
//     acceptedDownsell: boolean
//     createdAt?: string
// }



export type CancellationStep =
    | 'job-check'
    | 'reason'
    | 'feedback'
    | 'visa'
    | 'visa-alternative'
    | 'downsell'
    | 'survey'
    | 'cancellation-reason'
    | 'success'
    | 'success-visa-help'
    | 'success-downsell'
    | 'confirm'

export type ABVariant = 'A' | 'B'

export interface CancellationReason {
    id: string
    label: string
    value: string
}

export interface CancellationFlowState {
    currentStep: CancellationStep
    selectedReason: string | null
    jobStatus: string | null  // Changed from hasFoundJob: boolean to jobStatus: string
    variant: ABVariant
    originalPrice: number
    acceptedDownsell: boolean
    isLoading: boolean
    error: string | null
    fieldErrors: Record<string, string>
}

export interface JobFoundResponses {
    type: 'found_job' | 'still_searching' | 'other'
    responses?: Array<{
        question: string
        answer: string
    }>
}

export interface CancellationData {
    userId: string
    subscriptionId: string
    downsellVariant: ABVariant
    reason: string
    acceptedDownsell: boolean
    createdAt?: string
}