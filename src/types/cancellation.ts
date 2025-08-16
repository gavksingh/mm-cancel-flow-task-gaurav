export type CancellationStep =
    | 'job-check'
    | 'reason'
    | 'feedback'
    | 'visa'
    | 'visa-alternative'
    | 'downsell'
    | 'confirm'
    | 'success'

export type ABVariant = 'A' | 'B'

export interface CancellationReason {
    id: string
    label: string
    value: string
}

export interface CancellationFlowState {
    step: CancellationStep
    selectedReason: string | null
    hasFoundJob: boolean | null
    variant: ABVariant
    originalPrice: number
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