module.exports = {
  apps: [{
    name: 'atm-minasforce',
    script: './dist/server/entry.mjs',
    node_args: '--env-file=.env',
    cwd: '/var/www/atm.minasforce.com.br',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_memory_restart: '500M',
    env_production: {
      NODE_ENV: 'production',
      HOST: '127.0.0.1',
      PORT: 4321,
    },
  }],
};
