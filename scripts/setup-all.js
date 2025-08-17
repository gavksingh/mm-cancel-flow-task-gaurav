#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function checkDocker() {
    try {
        execSync('docker --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

async function applyMigrations() {
    console.log('\n📝 Applying database migrations...');

    const migrationsDir = path.join(__dirname, '../sql/migrations');

    if (!fs.existsSync(migrationsDir)) {
        console.log('⚠️  No migrations directory found, skipping...');
        return;
    }

    const migrations = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const migration of migrations) {
        console.log(`  Applying ${migration}...`);
        const sqlPath = path.join(migrationsDir, migration);

        try {
            // Try using psql first
            execSync(`PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f "${sqlPath}"`,
                { stdio: 'inherit' });
            console.log(`  ✅ ${migration} applied`);
        } catch (error) {
            // If psql fails, try using supabase db push
            console.log('  Trying alternative method...');
            try {
                execSync(`npx supabase db push --file "${sqlPath}"`, { stdio: 'inherit' });
                console.log(`  ✅ ${migration} applied`);
            } catch (e) {
                console.log(`  ⚠️  Failed to apply ${migration}, continuing...`);
            }
        }
    }
}

async function setup() {
    console.log('🚀 Starting Migrate Mate Cancellation Flow Setup...\n');

    // Check Docker
    if (!await checkDocker()) {
        console.error('❌ Docker is not installed or not running!');
        console.error('📦 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop');
        console.error('   and make sure it\'s running before continuing.');
        console.error('\n🔍 How to fix:');
        console.error('   1. Install Docker Desktop');
        console.error('   2. Start Docker Desktop application');
        console.error('   3. Wait for Docker whale icon to appear in system tray');
        console.error('   4. Run "npm run setup" again\n');
        process.exit(1);
    }

    console.log('✅ Docker detected\n');
    console.log('📦 Note: First-time setup will download Supabase Docker images (~500MB).');
    console.log('   This may take 3-5 minutes. Subsequent runs will be much faster!\n');

    try {
        // Setup environment
        execSync('node scripts/setup-env.js', { stdio: 'inherit' });

        // Verify environment file was created
        const envPath = path.join(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ Environment file not created! Creating manually...');
            const envContent = `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres`;
            fs.writeFileSync(envPath, envContent);
            console.log('✅ Environment file created manually');
        } else {
            console.log('✅ Environment file verified');
        }

        // Initialize Supabase
        console.log('🔧 Initializing Supabase project...');
        execSync('node scripts/init-supabase.js', { stdio: 'inherit' });

        // Start Supabase
        console.log('\n🐘 Starting Supabase...\n');
        try {
            execSync('npx supabase start', { stdio: 'inherit' });
        } catch (error) {
            console.error('\n❌ Failed to start Supabase!');
            console.error('🔍 Common causes:');
            console.error('   1. Docker not running properly');
            console.error('   2. Ports 54321/54322 already in use');
            console.error('   3. Supabase initialization incomplete');
            console.error('\n💡 Try these solutions:');
            console.error('   1. Restart Docker Desktop');
            console.error('   2. Run: npx kill-port 54321 54322');
            console.error('   3. Run: npm run setup again\n');
            throw error;
        }

        // Seed database with fresh state
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

        // Ensure clean cancellations table for fresh setup
        console.log('\n🧹 Ensuring fresh cancellations table...');
        try {
            execSync('PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "DELETE FROM cancellations;"', { stdio: 'inherit' });
            console.log('✅ Cancellations table cleaned');
        } catch (error) {
            console.log('⚠️  Could not clean cancellations table, but continuing...');
        }

        // Apply migrations
        await applyMigrations();

        console.log('\n' + '='.repeat(50));
        console.log('✅ Setup complete!');
        console.log('='.repeat(50));
        console.log('\n🚀 Starting development server...');
        console.log('📱 Visit http://localhost:3000/cancel to start testing');
        console.log('\n💡 Server will start automatically - no need to run "npm run dev"');
        console.log('⏳ Starting server now...\n');

        // Start the development server
        execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

setup();