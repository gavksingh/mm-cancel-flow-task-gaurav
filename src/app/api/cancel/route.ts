// import { NextRequest, NextResponse } from 'next/server'
// import { supabaseAdmin } from '@/lib/supabase'
// import { getDeterministicVariant } from '@/lib/ab-test'

// const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440001'

// export async function GET() {
//     try {
//         const { data: subscription } = await supabaseAdmin
//             .from('subscriptions')
//             .select('*')
//             .eq('user_id', MOCK_USER_ID)
//             .single()

//         if (!subscription) {
//             return NextResponse.json({
//                 price: 2500,
//                 subscription_id: null,
//                 status: 'active'
//             })
//         }

//         return NextResponse.json({
//             price: subscription.monthly_price,
//             subscription_id: subscription.id,
//             status: subscription.status
//         })
//     } catch (error) {
//         console.error('GET error:', error)
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         )
//     }
// }

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json()
//         console.log('[POST /api/cancel] Received:', body)

//         // Parse the reason data if it's stringified
//         let parsedData: any = body
//         if (typeof body === 'string') {
//             try {
//                 parsedData = JSON.parse(body)
//             } catch {
//                 parsedData = { reason: body }
//             }
//         }

//         // Get subscription
//         const { data: subscription, error: subError } = await supabaseAdmin
//             .from('subscriptions')
//             .select('*')
//             .eq('user_id', MOCK_USER_ID)
//             .single()

//         if (subError || !subscription) {
//             return NextResponse.json(
//                 { error: 'No subscription found' },
//                 { status: 404 }
//             )
//         }

//         // Check for existing cancellation to get variant
//         const { data: existingCancellation } = await supabaseAdmin
//             .from('cancellations')
//             .select('downsell_variant')
//             .eq('user_id', MOCK_USER_ID)
//             .order('created_at', { ascending: false })
//             .limit(1)
//             .single()

//         // Determine variant
//         let variant = existingCancellation?.downsell_variant || getDeterministicVariant(MOCK_USER_ID)

//         // Prepare cancellation data with ALL fields
//         const cancellationData: any = {
//             user_id: MOCK_USER_ID,
//             subscription_id: subscription.id,
//             downsell_variant: variant,
//             downsell_shown: variant === 'B',
//             accepted_downsell: parsedData.acceptedDownsell || false,
//             reason: typeof parsedData.reason === 'object'
//                 ? JSON.stringify(parsedData.reason)
//                 : (parsedData.reason || null)
//         }

//         // Add optional fields from the form data
//         if (parsedData.jobStatus) {
//             cancellationData.job_status = parsedData.jobStatus
//         }
//         if (parsedData.survey) {
//             cancellationData.survey_data = parsedData.survey
//         }
//         if (parsedData.feedback) {
//             cancellationData.feedback_text = parsedData.feedback
//         }
//         if (parsedData.maxPrice) {
//             // Convert to cents
//             const price = parseFloat(parsedData.maxPrice)
//             cancellationData.max_price = price > 100 ? Math.round(price) : Math.round(price * 100)
//         }
//         if (typeof parsedData.visaHelpAccepted === 'boolean') {
//             cancellationData.visa_help_accepted = parsedData.visaHelpAccepted
//         }

//         console.log('[POST /api/cancel] Inserting:', cancellationData)

//         // Insert cancellation
//         const { data: cancellation, error: cancelError } = await supabaseAdmin
//             .from('cancellations')
//             .insert(cancellationData)
//             .select()
//             .single()

//         if (cancelError) {
//             console.error('Cancel error:', cancelError)
//             return NextResponse.json(
//                 { error: 'Failed to process cancellation' },
//                 { status: 500 }
//             )
//         }

//         // Update subscription status
//         if (!parsedData.acceptedDownsell) {
//             await supabaseAdmin
//                 .from('subscriptions')
//                 .update({ status: 'pending_cancellation' })
//                 .eq('id', subscription.id)
//         }

//         return NextResponse.json({
//             success: true,
//             variant,
//             cancellationId: cancellation.id
//         })
//     } catch (error) {
//         console.error('Cancellation error:', error)
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         )
//     }
// }





import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getDeterministicVariant } from '@/lib/ab-test'

const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET() {
    try {
        const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', MOCK_USER_ID)
            .single()

        if (!subscription) {
            return NextResponse.json({
                price: 2500,
                subscription_id: null,
                status: 'active'
            })
        }

        return NextResponse.json({
            price: subscription.monthly_price,
            subscription_id: subscription.id,
            status: subscription.status
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
        console.log('[POST /api/cancel] Received:', body)

        // Parse the reason data if it's stringified
        let parsedData: any = body
        if (typeof body === 'string') {
            try {
                parsedData = JSON.parse(body)
            } catch {
                parsedData = { reason: body }
            }
        }

        // Get subscription
        const { data: subscription, error: subError } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', MOCK_USER_ID)
            .single()

        if (subError || !subscription) {
            return NextResponse.json(
                { error: 'No subscription found' },
                { status: 404 }
            )
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

        // IMPORTANT FIX: Check if downsell was actually shown
        // Downsell is shown ONLY if:
        // 1. Variant is B
        // 2. AND job status is NOT "Found job"
        const wasDownsellShown = variant === 'B' && parsedData.jobStatus !== 'Found job'

        // Prepare cancellation data with ALL fields
        const cancellationData: any = {
            user_id: MOCK_USER_ID,
            subscription_id: subscription.id,
            downsell_variant: variant,
            downsell_shown: wasDownsellShown,  // Fixed logic
            accepted_downsell: parsedData.acceptedDownsell || false,
            reason: typeof parsedData.reason === 'object'
                ? JSON.stringify(parsedData.reason)
                : (parsedData.reason || null)
        }

        // Add optional fields from the form data
        if (parsedData.jobStatus) {
            cancellationData.job_status = parsedData.jobStatus
        }
        if (parsedData.survey) {
            cancellationData.survey_data = parsedData.survey
        }
        if (parsedData.feedback) {
            cancellationData.feedback_text = parsedData.feedback
        }
        if (parsedData.maxPrice) {
            // Convert to cents
            const price = parseFloat(parsedData.maxPrice)
            cancellationData.max_price = price > 100 ? Math.round(price) : Math.round(price * 100)
        }
        if (typeof parsedData.visaHelpAccepted === 'boolean') {
            cancellationData.visa_help_accepted = parsedData.visaHelpAccepted
        }

        console.log('[POST /api/cancel] Inserting:', cancellationData)

        // Insert cancellation
        const { data: cancellation, error: cancelError } = await supabaseAdmin
            .from('cancellations')
            .insert(cancellationData)
            .select()
            .single()

        if (cancelError) {
            console.error('Cancel error:', cancelError)
            return NextResponse.json(
                { error: 'Failed to process cancellation' },
                { status: 500 }
            )
        }

        // Update subscription status
        if (!parsedData.acceptedDownsell) {
            await supabaseAdmin
                .from('subscriptions')
                .update({ status: 'pending_cancellation' })
                .eq('id', subscription.id)
        }

        return NextResponse.json({
            success: true,
            variant,
            cancellationId: cancellation.id
        })
    } catch (error) {
        console.error('Cancellation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}