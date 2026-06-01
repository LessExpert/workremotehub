#!/usr/bin/env node

/**
 * Build Monitor - Validates Next.js build status before starting servers
 * Ensures production build exists before attempting to start prod server
 * Automatically rebuilds if build is missing or corrupted
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class BuildMonitor {
  projectDir: string;
  nextDir: string;
  buildLockFile: string;

  constructor(projectDir = '/root/workremotehub-next') {
    this.projectDir = projectDir;
    this.nextDir = path.join(projectDir, '.next');
    this.buildLockFile = path.join(projectDir, '.next/.build-lock');
  }

  log(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] BuildMonitor: ${message}`);
  }

  checkBuildExists(): boolean {
    return fs.existsSync(this.nextDir) && 
           fs.existsSync(path.join(this.nextDir, 'server')) &&
           fs.existsSync(path.join(this.nextDir, 'standalone'));
  }

  checkBuildLock(): boolean {
    return fs.existsSync(this.buildLockFile);
  }

  createBuildLock(): void {
    fs.writeFileSync(this.buildLockFile, `${Date.now()}`);
    this.log('Created build lock file');
  }

  removeBuildLock(): void {
    if (fs.existsSync(this.buildLockFile)) {
      fs.unlinkSync(this.buildLockFile);
      this.log('Removed build lock file');
    }
  }

  async runBuild(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.log('Starting production build...');
      this.createBuildLock();
      
      const build = spawn('npm', ['run', 'build'], {
        cwd: this.projectDir,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      build.stdout.on('data', (data: Buffer) => {
        output += data.toString();
        this.log(`BUILD: ${data}`);
      });

      build.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
        this.log(`BUILD ERROR: ${data}`);
      });

      build.on('close', (code: number) => {
        this.removeBuildLock();
        
        if (code === 0) {
          this.log(`✅ Build completed successfully (exit code: ${code})`);
          resolve(true);
        } else {
          this.log(`❌ Build failed (exit code: ${code})`);
          this.log(`Error output: ${errorOutput}`);
          reject(new Error(`Build failed with code ${code}`));
        }
      });

      build.on('error', (error: Error) => {
        this.removeBuildLock();
        this.log(`❌ Build process error: ${error.message}`);
        reject(error);
      });
    });
  }

  async validateBuild(): Promise<boolean> {
    this.log('Validating production build...');
    
    // Check if build directory exists
    if (!this.checkBuildExists()) {
      this.log('❌ Production build directory not found');
      return false;
    }

    // Check if essential files exist
    const essentialFiles = [
      path.join(this.nextDir, 'server/index.js'),
      path.join(this.nextDir, 'server/package.json'),
      path.join(this.nextDir, 'standalone/server.js')
    ];

    for (const file of essentialFiles) {
      if (!fs.existsSync(file)) {
        this.log(`❌ Missing essential build file: ${file}`);
        return false;
      }
    }

    this.log('✅ Production build validation passed');
    return true;
  }

  async ensureProductionBuild(): Promise<boolean> {
    try {
      this.log('🔍 Starting production build validation...');

      // If build doesn't exist or is invalid, rebuild
      if (!this.checkBuildExists() || !this.checkBuildLock()) {
        this.log('📦 Build missing or invalid - triggering rebuild...');
        await this.runBuild();
      } else {
        this.log('✅ Build directory exists, validating...');
        if (!await this.validateBuild()) {
          this.log('📦 Build validation failed - triggering rebuild...');
          await this.runBuild();
        } else {
          this.log('✅ Existing build validated successfully');
        }
      }

      this.log('🎉 Production build validation complete - ready to start server');
      return true;

    } catch (error: any) {
      this.log(`❌ Build validation failed: ${error.message}`);
      // In production, we might want to restart PM2 or send alerts
      throw error;
    }
  }
}

// CLI usage
if (require.main === module) {
  const monitor = new BuildMonitor();
  
  monitor.ensureProductionBuild()
    .then(() => {
      console.log('✅ Build monitor completed successfully');
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error('❌ Build monitor failed:', error.message);
      process.exit(1);
    });
}

module.exports = BuildMonitor;