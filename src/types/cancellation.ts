export type CancellationStep = 'job-check' | 'reason' | 'downsell' | 'confirm' | 'success'

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
}

export interface CancellationData {
    userId: string
    subscriptionId: string
    downsellVariant: ABVariant
    reason: string
    acceptedDownsell: boolean
    createdAt?: string
}