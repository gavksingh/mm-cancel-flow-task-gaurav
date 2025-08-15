#!/usr/bin/env node

const { execSync } = require('child_process');

async function checkDocker() {
    try {
        execSync('docker --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

async function setup() {
    console.log('🚀 Starting Migrate Mate Cancellation Flow Setup...\n');

    // Check Docker
    if (!await checkDocker()) {
        console.error('❌ Docker is not installed or not running!');
        console.error('📦 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop');
        console.error('   and make sure it\'s running before continuing.\n');
        process.exit(1);
    }

    console.log('✅ Docker detected\n');
    console.log('📦 Note: First-time setup will download Supabase Docker images (~500MB).');
    console.log('   This may take 3-5 minutes. Subsequent runs will be much faster!\n');

    try {
        // Setup environment
        execSync('node scripts/setup-env.js', { stdio: 'inherit' });

        // Initialize Supabase
        execSync('node scripts/init-supabase.js', { stdio: 'inherit' });

        // Start Supabase
        console.log('\n🐘 Starting Supabase...\n');
        execSync('npx supabase start', { stdio: 'inherit' });

        // Seed database
        console.log('\n🌱 Seeding database...');
        try {
            execSync('PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f seed.sql', { stdio: 'inherit' });
            console.log('✅ Database seeded successfully');
        } catch (error) {
            console.log('⚠️  psql not found, trying alternative method...');
            try {
                execSync('npx supabase db push --file seed.sql', { stdio: 'inherit' });
                console.log('✅ Database seeded successfully');
            } catch (e) {
                console.log('⚠️  Seeding may have failed, but continuing...');
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ Setup complete!');
        console.log('='.repeat(50));
        console.log('\n🚀 Run "npm run dev" to start the application');
        console.log('📱 Then visit http://localhost:3000/cancel\n');
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

setup();