module.exports = {
  apps: [
    {
      name: 'burniqo-dev',
      script: './node_modules/next/dist/bin/next',
      args: 'dev',
      cwd: '/root/workremotehub-next',
      watch: ['src', 'pages', 'app'],
      ignore_watch: ['node_modules', '.next'],
      env: { NODE_ENV: 'development' },
    },
    {
      name: 'burniqo-prod',
      script: 'node scripts/start-prod.js',
      args: 'start',
      cwd: '/root/workremotehub-next',
      max_memory_restart: '1G',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'seed-crypto',
      script: 'scripts/seed-crypto.ts',
      cron_restart: '0 */6 * * *',
      cwd: '/root/workremotehub-next',
      interpreter: 'node',
      interpreter_args: '-r ts-node/register',
    },
  ],
};