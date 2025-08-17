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
        name: 'Remove duplicate subscriptions (keep most recent)',
        sql: `
            DELETE FROM subscriptions 
            WHERE id NOT IN (
                SELECT DISTINCT ON (user_id, status) id 
                FROM subscriptions 
                ORDER BY user_id, status, created_at DESC
            );
        `
    },
    {
        name: 'Reset all subscriptions to active status',
        sql: `
            UPDATE subscriptions 
            SET status = 'active', updated_at = NOW() 
            WHERE status != 'active';
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
