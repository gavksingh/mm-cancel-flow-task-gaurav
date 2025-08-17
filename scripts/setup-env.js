#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment...');

// Ensure we're in the project root (one level up from scripts)
const projectRoot = path.join(__dirname, '..');
const envPath = path.join(projectRoot, '.env.local');

console.log(`🔍 Project root: ${projectRoot}`);
console.log(`🔍 Environment file path: ${envPath}`);
if (!fs.existsSync(envPath)) {
  const envContent = `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local with default Supabase values');
  } catch (error) {
    console.error('❌ Failed to create .env.local:', error.message);
    console.error('🔍 Trying to create manually...');
    // Try creating with explicit permissions
    fs.writeFileSync(envPath, envContent, { mode: 0o644 });
    console.log('✅ Created .env.local with explicit permissions');
  }
} else {
  console.log('ℹ️  .env.local already exists');
  console.log(`📝 Contents preview: ${fs.readFileSync(envPath, 'utf8').substring(0, 50)}...`);
}

console.log('✅ Environment setup complete!');