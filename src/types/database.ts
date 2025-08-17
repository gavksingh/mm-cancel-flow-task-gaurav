export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    created_at: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    monthly_price: number // in cents
                    status: 'active' | 'pending_cancellation' | 'cancelled'
                    created_at: string
                    updated_at: string
                }
            }
            cancellations: {
                Row: {
                    id: string
                    user_id: string
                    subscription_id: string
                    downsell_variant: 'A' | 'B'
                    downsell_shown: boolean
                    accepted_downsell: boolean
                    job_status: 'Found job' | 'Still job searching' | null
                    survey_data: Json | null
                    reason: string | null
                    feedback_text: string | null
                    max_price: number | null // in cents
                    visa_help_accepted: boolean
                    created_at: string
                    updated_at: string
                }
            }
        }
    }
}

export type CancellationReason =
    | 'Too expensive'
    | 'Platform not helpful'
    | 'Not enough relevant jobs'
    | 'Decided not to move'
    | 'Other'

export interface CancellationData {
    jobStatus?: 'Found job' | 'Still job searching'
    reason?: CancellationReason | string
    acceptedDownsell?: boolean
    survey?: {
        rolesApplied?: string
        companiesEmailed?: string
        companiesInterviewed?: string
    }
    feedback?: string
    maxPrice?: string
    visaHelpAccepted?: boolean
}