#!/usr/bin/env node

/**
 * Database cleanup script to remove duplicate subscriptions and reset data
 * Usage: node scripts/cleanup-db.js
 */

const { execSync } = require('child_process');

console.log('🧹 Starting database cleanup...\n');

const queries = [
    {
        name: 'Clear all cancellations for fresh start',
        sql: `DELETE FROM cancellations;`
    },
    {
        name: 'Reset to clean subscription state - delete all existing subscriptions',
        sql: `DELETE FROM subscriptions;`
    },
    {
        name: 'Insert fresh active subscriptions for testing',
        sql: `
            INSERT INTO subscriptions (user_id, monthly_price, status) VALUES
            ('550e8400-e29b-41d4-a716-446655440001', 2500, 'active'),
            ('550e8400-e29b-41d4-a716-446655440002', 2900, 'active'),
            ('550e8400-e29b-41d4-a716-446655440003', 2500, 'active')
            ON CONFLICT DO NOTHING;
        `
    },
    {
        name: 'Show final subscription state',
        sql: `
            SELECT user_id, COUNT(*) as subscription_count, 
                   array_agg(status) as statuses
            FROM subscriptions 
            GROUP BY user_id 
            ORDER BY user_id;
        `
    }
];

try {
    for (const query of queries) {
        console.log(`📝 ${query.name}...`);

        const command = `PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "${query.sql.replace(/\n/g, ' ').trim()}"`;

        const result = execSync(command, {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        console.log(result.trim());
        console.log('');
    }

    console.log('✅ Database cleanup completed successfully!');

} catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    process.exit(1);
}
