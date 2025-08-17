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

      // Initialize supabase with default settings
      console.log('🔄 Running: npx supabase init');
      console.log('📝 Note: If prompted, press ENTER to accept defaults');

      // Use spawn for better interaction handling
      const { spawn } = require('child_process');

      await new Promise((resolve, reject) => {
        const child = spawn('npx', ['supabase', 'init'], {
          stdio: 'inherit',
          shell: process.platform === 'win32'
        });

        child.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Supabase init failed with code ${code}`));
          }
        });

        child.on('error', (error) => {
          reject(error);
        });
      });

      // Wait a moment for files to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify that config.toml was created
      if (fs.existsSync(configPath)) {
        console.log('✅ Supabase initialized successfully');

        // Replace with our safe config to prevent auto-seeding issues
        const templatePath = path.join(process.cwd(), 'supabase-config-template.toml');
        if (fs.existsSync(templatePath)) {
          console.log('🔧 Applying safe configuration to prevent seeding issues...');
          fs.copyFileSync(templatePath, configPath);
          console.log('✅ Safe configuration applied');
        }
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
      console.error('   npx supabase init');
      console.error('   Then check if supabase/config.toml exists\n');
      throw error;
    }
  } else {
    console.log('ℹ️  Supabase already initialized');

    // Check if we need to apply safe config to existing setup
    const templatePath = path.join(process.cwd(), 'supabase-config-template.toml');
    if (fs.existsSync(templatePath) && fs.existsSync(configPath)) {
      // Check if config has auto-seeding enabled
      const configContent = fs.readFileSync(configPath, 'utf8');
      if (configContent.includes('enabled = true') && configContent.includes('[db.seed]')) {
        console.log('🔧 Updating existing config to prevent seeding issues...');
        fs.copyFileSync(templatePath, configPath);
        console.log('✅ Safe configuration applied to existing setup');
      }
    }
  }

  // DO NOT copy seed.sql to supabase folder - this causes seeding order issues
  // The main setup script will handle seeding at the right time
  const seedDest = path.join(supabasePath, 'seed.sql');
  if (fs.existsSync(seedDest)) {
    console.log('🔧 Removing conflicting seed file to prevent order issues...');
    fs.unlinkSync(seedDest);
  }
}

// Run the initialization
initSupabase().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});