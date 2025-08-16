import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getDeterministicVariant } from '@/lib/ab-test'

// Mock user for testing - in production, get from auth
const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET() {
    try {
        // Get user's subscription and variant
        const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', MOCK_USER_ID)
            .eq('status', 'active')
            .single()

        if (!subscription) {
            // Return default values if no subscription found
            return NextResponse.json({
                subscription: {
                    monthly_price: 2500,
                    status: 'active'
                },
                variant: getDeterministicVariant(MOCK_USER_ID)
            })
        }

        let variant = subscription.downsell_variant
        if (!variant) {
            variant = getDeterministicVariant(MOCK_USER_ID)
        }

        return NextResponse.json({
            subscription,
            variant
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

        // Input validation
        if (!body.reason || (typeof body.reason !== 'string' && typeof body.reason !== 'object')) {
            return NextResponse.json(
                { error: 'Invalid reason' },
                { status: 400 }
            )
        }

        // Parse and sanitize reason (handle both string and JSON)
        let reason: string
        if (typeof body.reason === 'object') {
            // If it's a structured JSON response, stringify it
            try {
                reason = JSON.stringify(body.reason)
                // Validate the structure if it's a JobFoundResponses object
                if (body.reason.type && ['found_job', 'still_searching', 'other'].includes(body.reason.type)) {
                    // Valid structured response
                } else {
                    // Fallback to stringified version
                    reason = JSON.stringify(body.reason).slice(0, 1000)
                }
            } catch (error) {
                reason = 'Invalid structured response'
            }
        } else {
            // Simple string reason - sanitize input (prevent XSS)
            reason = body.reason.replace(/[<>]/g, '').trim().slice(0, 500)
        }

        // Get user's subscription
        const { data: subscription, error: subError } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', MOCK_USER_ID)
            .eq('status', 'active')
            .single()

        if (subError || !subscription) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            )
        }

        // Get or assign variant
        let variant = subscription.downsell_variant
        if (!variant) {
            variant = getDeterministicVariant(MOCK_USER_ID)

            // Store variant for future use
            await supabaseAdmin
                .from('subscriptions')
                .update({ downsell_variant: variant })
                .eq('id', subscription.id)
        }

        // Create cancellation record
        const { error: cancelError } = await supabaseAdmin
            .from('cancellations')
            .insert({
                user_id: MOCK_USER_ID,
                subscription_id: subscription.id,
                downsell_variant: variant,
                reason: reason,
                accepted_downsell: body.acceptedDownsell || false
            })

        if (cancelError) {
            console.error('Cancel error:', cancelError)
            return NextResponse.json(
                { error: 'Failed to process cancellation' },
                { status: 500 }
            )
        }

        // Update subscription status
        const newStatus = body.acceptedDownsell ? 'active' : 'pending_cancellation'
        const newPrice = body.acceptedDownsell && variant === 'B'
            ? subscription.monthly_price - 1000
            : subscription.monthly_price

        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: newStatus,
                monthly_price: newPrice
            })
            .eq('id', subscription.id)

        return NextResponse.json({
            success: true,
            variant,
            subscription_id: subscription.id
        })
    } catch (error) {
        console.error('Cancellation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}