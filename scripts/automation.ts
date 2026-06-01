// Automatically seed crypto data at set intervals (every hour)
export const CRON_JOB = {
  name: 'seed-crypto-data',
  schedule: '0 * * * *', // Hourly
  script: 'scripts/seed-crypto.ts',
};

// Auto-deploy on content changes (every 6 hours)
export const DEPLOY_JOB = {
  name: 'deploy-site',
  schedule: '0 */6 * * *', // Every 6 hours
  script: 'pipeline/publish.sh',
};