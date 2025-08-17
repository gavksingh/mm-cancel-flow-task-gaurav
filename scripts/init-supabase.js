#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function initSupabase() {
  console.log('🔧 Initializing Supabase...');

  // Check if supabase directory exists
  const supabasePath = path.join(process.cwd(), 'supabase');
  const configPath = path.join(supabasePath, 'config.toml');

  if (!fs.existsSync(supabasePath) || !fs.existsSync(configPath)) {
    try {
      console.log('🔧 Initializing Supabase project...');

      // Ensure we're in the right directory
      console.log(`🔍 Current directory: ${process.cwd()}`);

      // Initialize supabase without prompts
      execSync('npx supabase init --no-prompt', { stdio: 'inherit' });

      // Wait a moment for files to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify that config.toml was created
      if (fs.existsSync(configPath)) {
        console.log('✅ Supabase initialized successfully');
      } else {
        throw new Error('Supabase config.toml not created - check if Supabase CLI installed properly');
      }
    } catch (error) {
      console.error('❌ Supabase initialization failed!');
      console.error('🔍 This usually means:');
      console.error('   1. Supabase CLI installation issue');
      console.error('   2. Network connectivity problem');
      console.error('   3. Permission issues in current directory');
      console.error('\n💡 Try running these commands manually:');
      console.error('   npx supabase --version');
      console.error('   npx supabase init --no-prompt');
      console.error('   Then check if supabase/config.toml exists\n');
      throw error;
    }
  } else {
    console.log('ℹ️  Supabase already initialized');
  }

  // Copy seed.sql to supabase folder if needed
  const seedSource = path.join(process.cwd(), 'seed.sql');
  const seedDest = path.join(supabasePath, 'seed.sql');
  if (fs.existsSync(seedSource) && !fs.existsSync(seedDest)) {
    fs.copyFileSync(seedSource, seedDest);
    console.log('✅ Copied seed.sql to supabase folder');
  }
}

// Run the initialization
initSupabase().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});