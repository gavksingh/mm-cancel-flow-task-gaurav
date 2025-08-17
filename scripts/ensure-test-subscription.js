#!/usr/bin/env node

/**
 * Ensures test subscription is properly set up for development
 * Usage: node scripts/ensure-test-subscription.js
 */

const { execSync } = require('child_process');

console.log('🔧 Ensuring test subscription is properly configured...\n');

const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

try {
    // Check if subscription exists
    console.log('📋 Checking subscription state...');
    const checkResult = execSync(
        `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -t -c "SELECT COUNT(*), string_agg(status, ',') FROM subscriptions WHERE user_id = '${MOCK_USER_ID}';"`,
        { encoding: 'utf8', stdio: 'pipe' }
    ).trim();

    const [count, statuses] = checkResult.split('|').map(s => s.trim());
    console.log(`Found ${count} subscription(s) with status: ${statuses || 'none'}`);

    if (parseInt(count) === 0) {
        console.log('❌ No subscription found. Creating new active subscription...');
        execSync(
            `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "INSERT INTO subscriptions (user_id, monthly_price, status) VALUES ('${MOCK_USER_ID}', 2500, 'active');"`,
            { encoding: 'utf8', stdio: 'pipe' }
        );
        console.log('✅ Created new active subscription');
    } else if (parseInt(count) > 1) {
        console.log('⚠️ Multiple subscriptions found. Keeping most recent, removing others...');
        execSync(
            `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "DELETE FROM subscriptions WHERE user_id = '${MOCK_USER_ID}' AND id NOT IN (SELECT id FROM subscriptions WHERE user_id = '${MOCK_USER_ID}' ORDER BY created_at DESC LIMIT 1);"`,
            { encoding: 'utf8', stdio: 'pipe' }
        );
        console.log('✅ Removed duplicate subscriptions');
    }

    // Ensure subscription is in valid state (active or pending_cancellation)
    console.log('🔄 Ensuring subscription is in valid state...');
    execSync(
        `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "UPDATE subscriptions SET status = 'active' WHERE user_id = '${MOCK_USER_ID}' AND status NOT IN ('active', 'pending_cancellation', 'cancelled');"`,
        { encoding: 'utf8', stdio: 'pipe' }
    );

    // Verify final state
    const finalResult = execSync(
        `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT id, status, monthly_price FROM subscriptions WHERE user_id = '${MOCK_USER_ID}';"`,
        { encoding: 'utf8', stdio: 'pipe' }
    );

    console.log('\n📊 Final subscription state:');
    console.log(finalResult);

    // Test API endpoint
    console.log('🧪 Testing API endpoint...');
    try {
        const apiTest = execSync('curl -s http://localhost:3000/api/cancel', { encoding: 'utf8', stdio: 'pipe' });
        const apiData = JSON.parse(apiTest);

        if (apiData.subscription_id) {
            console.log('✅ API test successful');
            console.log(`   Subscription ID: ${apiData.subscription_id}`);
            console.log(`   Price: $${apiData.price / 100}`);
            console.log(`   Status: ${apiData.status}`);
        } else {
            console.log('❌ API test failed - no subscription_id returned');
        }
    } catch (error) {
        console.log('❌ API test failed:', error.message);
    }

    console.log('\n✅ Test subscription setup complete!');

} catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
}
