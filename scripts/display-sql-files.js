#!/usr/bin/env node

/**
 * This script displays the SQL files for setting up storage and RLS policies.
 */

const fs = require('fs');
const path = require('path');

// Paths to the SQL files
const createBucketSqlPath = path.join(__dirname, '..', 'migrations', 'create_bucket.sql');
const setupRlsPoliciesSqlPath = path.join(__dirname, '..', 'migrations', 'setup_rls_policies.sql');

try {
  // Read the SQL files
  const createBucketSql = fs.readFileSync(createBucketSqlPath, 'utf8');
  const setupRlsPoliciesSql = fs.readFileSync(setupRlsPoliciesSqlPath, 'utf8');
  
  console.log('='.repeat(80));
  console.log('STEP 1: CREATE BUCKET');
  console.log('='.repeat(80));
  console.log('\nCopy and paste the following SQL into the Supabase SQL Editor:\n');
  console.log(createBucketSql);
  console.log('\n');
  
  console.log('='.repeat(80));
  console.log('STEP 2: SETUP RLS POLICIES');
  console.log('='.repeat(80));
  console.log('\nAfter the bucket is created, copy and paste the following SQL:\n');
  console.log(setupRlsPoliciesSql);
  console.log('\n');
  
  console.log('='.repeat(80));
  console.log('INSTRUCTIONS:');
  console.log('1. Go to the Supabase Dashboard');
  console.log('2. Click on "SQL Editor" in the left sidebar');
  console.log('3. Create a new query');
  console.log('4. First run STEP 1 to create the bucket');
  console.log('5. Then run STEP 2 to set up the RLS policies');
  console.log('='.repeat(80));
} catch (error) {
  console.error('Error reading SQL files:', error);
  process.exit(1);
}
