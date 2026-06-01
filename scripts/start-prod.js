#!/usr/bin/env node

/**
 * Start Production Server with Build Validation
 * Ensures a valid production build exists before starting Next.js server
 */

const { spawn } = require('child_process');
const BuildMonitor = require('./build-monitor');

async function startServer() {
  const monitor = new BuildMonitor();
  
  console.log('🚀 Starting production server with build validation...');
  
  try {
    // Ensure we have a valid build
    await monitor.ensureProductionBuild();
    
    console.log('✅ Build validation passed - starting Next.js production server...');
    
    // Start Next.js production server
    const next = spawn('node_modules/next/dist/bin/next', ['start'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });

    next.on('error', (err) => {
      console.error('❌ Failed to start Next.js server:', err);
      process.exit(1);
    });

    next.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Next.js server exited with code ${code}`);
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error('❌ Build validation failed:', error.message);
    console.error('❌ Unable to start production server due to build issues');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  startServer().catch((err) => {
    console.error('❌ Fatal error in start-prod:', err);
    process.exit(1);
  });
}

module.exports = { startServer };