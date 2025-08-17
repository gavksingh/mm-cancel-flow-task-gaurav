#!/usr/bin/env node

/**
 * Test script for pending cancellation functionality
 * Usage: node scripts/test-pending-cancellation.js [active|pending]
 */

const { execSync } = require('child_process');

const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440001';
const action = process.argv[2] || 'pending';

console.log(`🧪 Testing pending cancellation functionality...\n`);

try {
    if (action === 'active') {
        console.log('🔄 Setting subscription to ACTIVE status...');
        execSync(
            `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "UPDATE subscriptions SET status = 'active' WHERE user_id = '${MOCK_USER_ID}';"`,
            { encoding: 'utf8', stdio: 'pipe' }
        );
        console.log('✅ Subscription set to active');
        console.log('🎯 Test: Visit http://localhost:3000/cancel - should show normal cancellation flow');
    } else {
        console.log('🔄 Setting subscription to PENDING_CANCELLATION status...');
        execSync(
            `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "UPDATE subscriptions SET status = 'pending_cancellation' WHERE user_id = '${MOCK_USER_ID}';"`,
            { encoding: 'utf8', stdio: 'pipe' }
        );
        console.log('✅ Subscription set to pending_cancellation');
        console.log('🎯 Test: Visit http://localhost:3000/cancel - should show "cancellation already in progress" message');
    }

    // Test API response
    console.log('\n📡 Testing API response...');
    const apiResponse = execSync('curl -s http://localhost:3000/api/cancel', { encoding: 'utf8' });
    const data = JSON.parse(apiResponse);

    console.log(`   Status: ${data.status}`);
    console.log(`   isPendingCancellation: ${data.isPendingCancellation}`);
    console.log(`   Subscription ID: ${data.subscription_id}`);

    // Show current database state
    console.log('\n📊 Current database state:');
    const dbState = execSync(
        `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT status, monthly_price, created_at FROM subscriptions WHERE user_id = '${MOCK_USER_ID}';"`,
        { encoding: 'utf8' }
    );
    console.log(dbState);

    console.log('\n🎯 Test Instructions:');
    console.log('1. Visit: http://localhost:3000/cancel');
    if (action === 'active') {
        console.log('2. Expected: Normal cancellation flow starts');
        console.log('3. Complete the cancellation flow normally');
        console.log('4. After completion, try visiting /cancel again');
        console.log('5. Expected: Should show "Cancellation Request Received" message');
        console.log('\n📋 Alternative test:');
        console.log('   To simulate already pending: npm run test:pending-cancellation pending');
    } else {
        console.log('2. Expected: Normal flow (NOT the pending message yet)');
        console.log('3. Complete the cancellation flow');
        console.log('4. Expected: At the END, should show "Cancellation Request Received"');
        console.log('\n📋 Alternative test:');
        console.log('   To test normal flow: npm run test:pending-cancellation active');
    }

} catch (error) {
    console.error('❌ Test setup failed:', error.message);
    process.exit(1);
}
