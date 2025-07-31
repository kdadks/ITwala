#!/usr/bin/env node

/**
 * Session Conflict Diagnosis and Fix Script
 * 
 * This script helps identify and fix session conflicts in the ITWala Academy app.
 * The 409 error typically occurs when multiple Supabase clients try to manage
 * the same session with different configurations.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test different client configurations
async function diagnoseSessionConflicts() {
  console.log('🔍 Diagnosing Session Conflicts...\n');

  const configs = [
    {
      name: 'Default Config',
      config: {}
    },
    {
      name: 'Persistent Session',
      config: {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    },
    {
      name: 'No Persistence',
      config: {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    },
    {
      name: 'PKCE Flow',
      config: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`\n📋 Testing: ${name}`);
    console.log('Config:', JSON.stringify(config, null, 2));
    
    try {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        config
      );

      // Test session creation
      const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
        email: 'admin@itwala.com',
        password: 'Admin@123'
      });

      if (signInError) {
        console.log(`❌ Sign In Error: ${signInError.message}`);
        if (signInError.message.includes('409')) {
          console.log('🚨 409 Conflict detected with this configuration!');
        }
      } else {
        console.log('✅ Sign In Successful');
        
        // Test session retrieval
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        
        if (sessionError) {
          console.log(`❌ Session Error: ${sessionError.message}`);
          if (sessionError.message.includes('409')) {
            console.log('🚨 409 Conflict detected during session retrieval!');
          }
        } else {
          console.log(`✅ Session Retrieved: ${session ? 'Valid' : 'None'}`);
        }

        // Clean up
        await client.auth.signOut();
      }
    } catch (error) {
      console.log(`❌ Exception: ${error.message}`);
      if (error.message.includes('409')) {
        console.log('🚨 409 Conflict detected in exception!');
      }
    }
  }

  console.log('\n🔧 Recommendations:');
  console.log('1. Use consistent auth configuration across all clients');
  console.log('2. Avoid creating multiple clients with different session persistence settings');
  console.log('3. Use PKCE flow for better security and compatibility');
  console.log('4. Clear localStorage if conflicts persist');
}

// Clear all auth-related storage
async function clearAuthStorage() {
  console.log('🧹 Clearing all auth-related storage...');
  
  // This would run in browser context
  const storageKeys = [
    'supabase.auth.token',
    'supabase-auth-token',
    'sb-auth-token',
    'auth.token'
  ];

  console.log('Storage keys to clear:', storageKeys);
  console.log('Note: Run this in browser console:');
  console.log('localStorage.clear(); sessionStorage.clear();');
}

// Main execution
async function main() {
  console.log('🎯 ITWala Academy Session Conflict Fixer\n');
  
  const action = process.argv[2];
  
  switch (action) {
    case 'diagnose':
      await diagnoseSessionConflicts();
      break;
    case 'clear':
      await clearAuthStorage();
      break;
    default:
      console.log('Usage:');
      console.log('  node fix-session-conflicts.js diagnose  - Test different configurations');
      console.log('  node fix-session-conflicts.js clear     - Show storage clearing instructions');
      console.log('\nRunning diagnosis by default...\n');
      await diagnoseSessionConflicts();
  }
}

main().catch(console.error);
