import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getDeterministicVariant } from '@/lib/ab-test'

const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET() {
    try {
        const { data: subscriptions, error } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', MOCK_USER_ID)
            .in('status', ['active', 'pending_cancellation'])
            .order('created_at', { ascending: false })

        if (error || !subscriptions || subscriptions.length === 0) {
            console.log('❌ [API] No valid subscription found:', error)
            return NextResponse.json(
                { error: 'No valid subscription found' },
                { status: 404 }
            )
        }

        // Take the most recent active subscription
        const subscription = subscriptions[0]

        if (subscriptions.length > 1) {
            console.warn(`⚠️ [API] Found ${subscriptions.length} active subscriptions for user, using most recent`)
        }

        return NextResponse.json({
            price: subscription.monthly_price,
            subscription_id: subscription.id,
            status: subscription.status,
            isPendingCancellation: subscription.status === 'pending_cancellation'
        })
    } catch (error) {
        console.error('GET error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('🔍 [API] Raw body received:', JSON.stringify(body, null, 2))

        // Parse the reason data if it's stringified
        let parsedData: any = body
        if (typeof body === 'string') {
            try {
                parsedData = JSON.parse(body)
                console.log('📄 [API] Parsed from string:', JSON.stringify(parsedData, null, 2))
            } catch {
                parsedData = { reason: body }
                console.log('⚠️ [API] Failed to parse, treating as plain reason:', parsedData)
            }
        }

        console.log('📊 [API] Final parsedData:', JSON.stringify(parsedData, null, 2))

        // Get subscription (only active ones)
        const { data: subscriptions, error: subError } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', MOCK_USER_ID)
            .in('status', ['active', 'pending_cancellation'])
            .order('created_at', { ascending: false })

        if (subError || !subscriptions || subscriptions.length === 0) {
            console.log('❌ [API] No valid subscription found:', subError)
            return NextResponse.json(
                { error: 'No valid subscription found' },
                { status: 404 }
            )
        }

        // Take the most recent active subscription
        const subscription = subscriptions[0]

        if (subscriptions.length > 1) {
            console.warn(`⚠️ [API] Found ${subscriptions.length} active subscriptions for user, using most recent`)
        }

        console.log('✅ [API] Subscription found:', subscription.id)

        // Check if subscription is already pending cancellation
        if (subscription.status === 'pending_cancellation') {
            console.log('ℹ️ [API] Subscription already pending cancellation, returning special response')
            return NextResponse.json({
                success: true,
                alreadyPending: true,
                variant: 'A', // Default variant for already pending
                message: 'Cancellation already in progress'
            })
        }

        // Check for existing cancellation to get variant
        const { data: existingCancellation } = await supabaseAdmin
            .from('cancellations')
            .select('downsell_variant')
            .eq('user_id', MOCK_USER_ID)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        // Determine variant
        let variant = existingCancellation?.downsell_variant || getDeterministicVariant(MOCK_USER_ID)
        console.log('🎯 [API] Using variant:', variant)

        // =============================================
        // CRITICAL FIX: Extract job_status from type field
        // =============================================
        let jobStatus: string | null = null

        // Method 1: Direct jobStatus field (from context)
        if (parsedData.jobStatus) {
            jobStatus = parsedData.jobStatus
            console.log('📋 [API] jobStatus from direct field:', jobStatus)
        }

        // Method 2: Extract from type field (from ReasonStep)
        if (parsedData.type) {
            if (parsedData.type === 'found_job') {
                jobStatus = 'Found job'
            } else if (parsedData.type === 'still_searching') {
                jobStatus = 'Still job searching'
            }
            console.log(`📋 [API] jobStatus mapped from type "${parsedData.type}":`, jobStatus)
        }

        // Method 3: Fallback check from nested reason data
        if (!jobStatus && typeof parsedData.reason === 'object' && parsedData.reason.jobStatus) {
            jobStatus = parsedData.reason.jobStatus
            console.log('📋 [API] jobStatus from nested reason:', jobStatus)
        }

        console.log('🎯 [API] Final jobStatus determined:', jobStatus)

        // =============================================
        // CRITICAL FIX: Extract survey data from responses array
        // =============================================
        let surveyData: any = null

        // Method 1: Direct survey field
        if (parsedData.survey) {
            surveyData = parsedData.survey
            console.log('📊 [API] Survey from direct field:', surveyData)
        }

        // Method 2: Extract from responses array (from ReasonStep)
        if (parsedData.responses && Array.isArray(parsedData.responses)) {
            const responses = parsedData.responses
            surveyData = {
                foundWithMM: responses.find((r: any) => r.question.includes('Did you find this job with MigrateMate'))?.answer,
                rolesApplied: responses.find((r: any) => r.question.includes('How many roles did you apply'))?.answer,
                companiesEmailed: responses.find((r: any) => r.question.includes('How many companies did you email'))?.answer,
                companiesInterviewed: responses.find((r: any) => r.question.includes('How many different companies did you interview'))?.answer
            }
            console.log('📊 [API] Survey extracted from responses:', surveyData)
        }

        // =============================================
        // CRITICAL FIX: Map visaAssistance to visa_help_accepted
        // =============================================
        let visaHelpAccepted: boolean | null = null

        // Method 1: Direct visaHelpAccepted field
        if (typeof parsedData.visaHelpAccepted === 'boolean') {
            visaHelpAccepted = parsedData.visaHelpAccepted
            console.log('🛂 [API] visaHelpAccepted from direct field:', visaHelpAccepted)
        }

        // Method 2: Map from visaAssistance field
        if (typeof parsedData.visaAssistance === 'boolean') {
            visaHelpAccepted = parsedData.visaAssistance
            console.log('🛂 [API] visaHelpAccepted mapped from visaAssistance:', visaHelpAccepted)
        }

        // =============================================
        // CRITICAL FIX: Correct downsell_shown logic
        // =============================================
        // Downsell is shown ONLY if:
        // 1. Variant is B AND
        // 2. Job status is NOT "Found job" (user is still searching)
        const wasDownsellShown = variant === 'B' && jobStatus !== 'Found job'
        console.log(`🎯 [API] Downsell logic: variant=${variant}, jobStatus="${jobStatus}" => downsell_shown=${wasDownsellShown}`)

        // =============================================
        // CRITICAL FIX: Extract acceptedDownsell correctly
        // =============================================
        let acceptedDownsell = false

        // Check all possible sources for downsell acceptance
        if (parsedData.acceptedDownsell === true) {
            acceptedDownsell = true
            console.log('💰 [API] acceptedDownsell from direct field: TRUE')
        } else if (parsedData.acceptedAfterSurvey === true) {
            acceptedDownsell = true
            console.log('💰 [API] acceptedDownsell from acceptedAfterSurvey: TRUE')
        } else if (parsedData.acceptedAfterReason === true) {
            acceptedDownsell = true
            console.log('💰 [API] acceptedDownsell from acceptedAfterReason: TRUE')
        } else if (parsedData.acceptedAfterDownsell === true) {
            acceptedDownsell = true
            console.log('💰 [API] acceptedDownsell from acceptedAfterDownsell: TRUE')
        } else {
            console.log('💰 [API] acceptedDownsell: FALSE (user declined or no downsell shown)')
        }

        console.log('🎯 [API] Final acceptedDownsell value:', acceptedDownsell)

        // Prepare cancellation data with ALL fields
        const cancellationData: any = {
            user_id: MOCK_USER_ID,
            subscription_id: subscription.id,
            downsell_variant: variant,
            downsell_shown: wasDownsellShown,
            accepted_downsell: acceptedDownsell,
            reason: typeof parsedData.reason === 'object'
                ? JSON.stringify(parsedData.reason)
                : (parsedData.reason || null)
        }

        // Add all mapped fields
        if (jobStatus) {
            cancellationData.job_status = jobStatus
        }

        if (surveyData) {
            cancellationData.survey_data = surveyData
        }

        if (parsedData.feedback) {
            cancellationData.feedback_text = parsedData.feedback
        }

        if (parsedData.maxPrice) {
            // Convert to cents if needed
            const price = parseFloat(parsedData.maxPrice)
            cancellationData.max_price = price > 100 ? Math.round(price) : Math.round(price * 100)
        }

        if (visaHelpAccepted !== null) {
            cancellationData.visa_help_accepted = visaHelpAccepted
        }

        console.log('💾 [API] Final cancellation data to insert:', JSON.stringify(cancellationData, null, 2))

        // Insert cancellation
        const { data: cancellation, error: cancelError } = await supabaseAdmin
            .from('cancellations')
            .insert(cancellationData)
            .select()
            .single()

        if (cancelError) {
            console.error('❌ [API] Database insert error:', cancelError)
            return NextResponse.json(
                { error: 'Failed to process cancellation' },
                { status: 500 }
            )
        }

        console.log('✅ [API] Cancellation inserted successfully:', cancellation.id)

        // Update subscription status
        if (!cancellationData.accepted_downsell) {
            console.log('📝 [API] Updating subscription status to pending_cancellation')
            await supabaseAdmin
                .from('subscriptions')
                .update({ status: 'pending_cancellation' })
                .eq('id', subscription.id)
        }

        console.log('🎉 [API] Complete success! Returning response.')

        return NextResponse.json({
            success: true,
            variant,
            cancellationId: cancellation.id
        })
    } catch (error) {
        console.error('💥 [API] Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}